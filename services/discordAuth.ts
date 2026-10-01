/**
 * Discord OAuth2 Authentication Service
 *
 * Uses expo-auth-session for the OAuth2 PKCE flow.
 * After token exchange, fetches user info and guilds from Discord REST API.
 *
 * Required .env variables:
 *   EXPO_PUBLIC_DISCORD_CLIENT_ID   — your Discord application client ID
 *   EXPO_PUBLIC_BOT_CLIENT_ID       — same as above (for guild filtering)
 *
 * Discord OAuth2 scopes used:
 *   - identify   → user info (username, avatar, id)
 *   - email      → user email
 *   - guilds     → list of servers the user is in
 */

import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BotGuild, DiscordUser } from '@/types';
import { MOCK_GUILDS, MOCK_BOT_STATS } from './mockData';

// Required by expo-auth-session on native
WebBrowser.maybeCompleteAuthSession();

// ─── Constants ────────────────────────────────────────────────────────────────

const CLIENT_ID = process.env.EXPO_PUBLIC_DISCORD_CLIENT_ID ?? '';

const DISCORD_API = 'https://discord.com/api/v10';

const SCOPES = ['identify', 'email', 'guilds'];

// Permission bit for "Manage Guild" (0x00000020)
const MANAGE_GUILD_PERMISSION = 0x20;

// AsyncStorage keys
const STORAGE_ACCESS_TOKEN = '@denzzmusic:discord_access_token';
const STORAGE_TOKEN_EXPIRY = '@denzzmusic:discord_token_expiry';
const STORAGE_USER = '@denzzmusic:discord_user';
const STORAGE_BOT_GUILD_IDS = '@denzzmusic:bot_guild_ids';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthResult {
  user: DiscordUser;
  accessToken: string;
  expiresAt: number;
}

interface DiscordGuildRaw {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string; // numeric string (v10 returns string)
  features: string[];
  approximate_member_count?: number;
}

// ─── OAuth2 Discovery ─────────────────────────────────────────────────────────

const discovery: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: 'https://discord.com/api/oauth2/authorize',
  tokenEndpoint: 'https://discord.com/api/oauth2/token',
  revocationEndpoint: 'https://discord.com/api/oauth2/token/revoke',
};

// ─── Build Auth Request ───────────────────────────────────────────────────────

export function buildAuthRequest() {
  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'denzzmusic' });

  const request = new AuthSession.AuthRequest({
    clientId: CLIENT_ID,
    scopes: SCOPES,
    redirectUri,
    responseType: AuthSession.ResponseType.Code,
    usePKCE: true,
    extraParams: {
      prompt: 'consent',
    },
  });

  return { request, redirectUri };
}

// ─── Token Exchange ───────────────────────────────────────────────────────────

export async function exchangeCodeForToken(
  code: string,
  codeVerifier: string,
  redirectUri: string
): Promise<string> {
  if (!CLIENT_ID) {
    throw new Error(
      'EXPO_PUBLIC_DISCORD_CLIENT_ID is not set. Add it to your .env file.'
    );
  }

  // NOTE: Discord does NOT support PKCE token exchange from pure clients —
  // it requires client_secret. For a pure mobile app without a backend proxy,
  // we use the implicit token flow (token in fragment) OR a backend proxy.
  //
  // For this implementation we use the Authorization Code flow via a backend
  // proxy endpoint: POST /auth/discord/exchange
  // If no backend is configured, we fall back to mock mode.

  const BOT_API_URL = process.env.EXPO_PUBLIC_BOT_API_URL || '';

  if (!BOT_API_URL || BOT_API_URL.includes('your-bot')) {
    // No real backend — cannot exchange code without client_secret
    throw new Error('NO_BACKEND');
  }

  const res = await fetch(`${BOT_API_URL}/auth/discord/exchange`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, code_verifier: codeVerifier, redirect_uri: redirectUri }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Token exchange failed: ${err}`);
  }

  const data = await res.json();
  return data.access_token as string;
}

// ─── Discord API Calls ────────────────────────────────────────────────────────

export async function fetchDiscordUser(accessToken: string): Promise<DiscordUser> {
  const res = await fetch(`${DISCORD_API}/users/@me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error('Failed to fetch Discord user');

  const data = await res.json();
  return {
    id: data.id,
    username: data.username,
    discriminator: data.discriminator ?? '0',
    avatar: data.avatar
      ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png?size=256`
      : null,
    email: data.email ?? undefined,
    accessToken,
  };
}

export async function fetchUserGuilds(accessToken: string): Promise<DiscordGuildRaw[]> {
  const res = await fetch(`${DISCORD_API}/users/@me/guilds?with_counts=true`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error('Failed to fetch guilds');
  return res.json();
}

// ─── Guild Filtering ──────────────────────────────────────────────────────────

/**
 * Filters guilds to those where:
 *  1. User has "Manage Guild" permission (is admin/mod)
 *  2. The bot is present in that guild
 *
 * For bot presence check: calls the bot API endpoint GET /guilds (returns list of IDs the bot is in).
 * Falls back to mock data if no bot API is configured.
 */
export async function fetchBotGuildIds(): Promise<Set<string>> {
  const BOT_API_URL = process.env.EXPO_PUBLIC_BOT_API_URL || '';

  if (!BOT_API_URL || BOT_API_URL.includes('your-bot')) {
    // Use mock guild IDs
    return new Set(MOCK_GUILDS.filter(g => g.botPresent).map(g => g.id));
  }

  try {
    const res = await fetch(`${BOT_API_URL}/guilds/ids`, {
      headers: { 'x-api-key': process.env.EXPO_PUBLIC_BOT_API_KEY ?? '' },
    });
    if (!res.ok) throw new Error('Bot API unavailable');
    const data: string[] = await res.json();
    return new Set(data);
  } catch {
    // Fallback: return empty set (no bot guilds known)
    return new Set();
  }
}

export function filterManagedGuilds(
  rawGuilds: DiscordGuildRaw[],
  botGuildIds: Set<string>
): BotGuild[] {
  return rawGuilds
    .filter(g => {
      const perms = BigInt(g.permissions ?? '0');
      const canManage = (perms & BigInt(MANAGE_GUILD_PERMISSION)) === BigInt(MANAGE_GUILD_PERMISSION);
      return canManage || g.owner;
    })
    .map<BotGuild>(g => ({
      id: g.id,
      name: g.name,
      icon: g.icon
        ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png?size=256`
        : null,
      memberCount: g.approximate_member_count ?? 0,
      botPresent: botGuildIds.has(g.id),
      voiceChannel: null,
      voiceChannelName: null,
      mode247: false,
      isPlaying: false,
      currentTrack: null,
    }));
}

// ─── Token Storage ────────────────────────────────────────────────────────────

export async function saveSession(token: string, expiresIn: number, user: DiscordUser) {
  const expiresAt = Date.now() + expiresIn * 1000;
  await AsyncStorage.multiSet([
    [STORAGE_ACCESS_TOKEN, token],
    [STORAGE_TOKEN_EXPIRY, String(expiresAt)],
    [STORAGE_USER, JSON.stringify(user)],
  ]);
}

export async function loadSession(): Promise<{ token: string; user: DiscordUser } | null> {
  try {
    const [[, token], [, expiryStr], [, userStr]] = await AsyncStorage.multiGet([
      STORAGE_ACCESS_TOKEN,
      STORAGE_TOKEN_EXPIRY,
      STORAGE_USER,
    ]);

    if (!token || !expiryStr || !userStr) return null;

    const expiresAt = parseInt(expiryStr, 10);
    // Treat token as expired 5 min early
    if (Date.now() > expiresAt - 5 * 60 * 1000) {
      await clearSession();
      return null;
    }

    return { token, user: JSON.parse(userStr) };
  } catch {
    return null;
  }
}

export async function clearSession() {
  await AsyncStorage.multiRemove([
    STORAGE_ACCESS_TOKEN,
    STORAGE_TOKEN_EXPIRY,
    STORAGE_USER,
    STORAGE_BOT_GUILD_IDS,
  ]);
}

// ─── Full Login Flow ──────────────────────────────────────────────────────────

export type LoginMode = 'real' | 'mock';

/**
 * Determines which login mode to use:
 * - 'real'  if EXPO_PUBLIC_DISCORD_CLIENT_ID is set AND a real bot API URL exists
 * - 'mock'  otherwise
 */
export function getLoginMode(): LoginMode {
  const clientId = process.env.EXPO_PUBLIC_DISCORD_CLIENT_ID ?? '';
  const botApi = process.env.EXPO_PUBLIC_BOT_API_URL ?? '';
  const hasRealConfig =
    clientId.length > 0 &&
    !clientId.includes('YOUR') &&
    botApi.length > 0 &&
    !botApi.includes('your-bot');
  return hasRealConfig ? 'real' : 'mock';
}
