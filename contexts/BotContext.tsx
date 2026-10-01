import React, {
  createContext, useState, useEffect, useRef, useCallback, ReactNode,
} from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { QueueState, BotStats, BotGuild, DiscordUser } from '@/types';
import { fetchBotStats, fetchQueue, fetchGuilds } from '@/services/botApi';
import { MOCK_USER, MOCK_GUILDS, MOCK_BOT_STATS } from '@/services/mockData';
import {
  buildAuthRequest,
  exchangeCodeForToken,
  fetchDiscordUser,
  fetchUserGuilds,
  fetchBotGuildIds,
  filterManagedGuilds,
  saveSession,
  loadSession,
  clearSession,
  getLoginMode,
} from '@/services/discordAuth';

WebBrowser.maybeCompleteAuthSession();

// ─── Context Type ─────────────────────────────────────────────────────────────

interface BotContextType {
  user: DiscordUser | null;
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  loginMode: 'real' | 'mock';
  stats: BotStats | null;
  guilds: BotGuild[];
  selectedGuild: BotGuild | null;
  queueState: QueueState | null;
  isLoading: boolean;
  isRefreshing: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  selectGuild: (guild: BotGuild) => void;
  refreshAll: () => Promise<void>;
  updateQueueState: (state: Partial<QueueState>) => void;
  updateGuild: (guildId: string, updates: Partial<BotGuild>) => void;
}

export const BotContext = createContext<BotContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function BotProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true); // resolves after session check
  const [loginMode] = useState<'real' | 'mock'>(getLoginMode());

  const [stats, setStats] = useState<BotStats | null>(null);
  const [guilds, setGuilds] = useState<BotGuild[]>([]);
  const [selectedGuild, setSelectedGuild] = useState<BotGuild | null>(null);
  const [queueState, setQueueState] = useState<QueueState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Build OAuth request ────────────────────────────────────────────────────
  const { request, redirectUri } = buildAuthRequest();
  const [, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_DISCORD_CLIENT_ID ?? '',
      scopes: ['identify', 'email', 'guilds'],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
      extraParams: { prompt: 'consent' },
    },
    {
      authorizationEndpoint: 'https://discord.com/api/oauth2/authorize',
      tokenEndpoint: 'https://discord.com/api/oauth2/token',
      revocationEndpoint: 'https://discord.com/api/oauth2/token/revoke',
    }
  );

  // ─── Handle OAuth response ──────────────────────────────────────────────────
  useEffect(() => {
    if (response?.type !== 'success') return;

    const code = response.params?.code;
    const codeVerifier = request?.codeVerifier;
    if (!code || !codeVerifier) return;

    (async () => {
      setIsAuthLoading(true);
      try {
        const token = await exchangeCodeForToken(code, codeVerifier, redirectUri);
        const discordUser = await fetchDiscordUser(token);
        await saveSession(token, 604800, discordUser); // 7-day TTL
        setUser(discordUser);
        setIsLoggedIn(true);
        await loadDiscordGuilds(token);
      } catch (err: any) {
        if (err?.message === 'NO_BACKEND') {
          // Backend not configured — fallback to mock after real auth attempt
          completeMockLogin();
        }
        // Otherwise silently fail; user stays logged out
      } finally {
        setIsAuthLoading(false);
      }
    })();
  }, [response]);

  // ─── Restore session on mount ───────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const session = await loadSession();
        if (session) {
          setUser(session.user);
          setIsLoggedIn(true);
          await loadDiscordGuilds(session.token);
        }
      } catch {
        // no saved session
      } finally {
        setIsAuthLoading(false);
      }
    })();
  }, []);

  // ─── Load real Discord guilds ───────────────────────────────────────────────
  const loadDiscordGuilds = async (accessToken: string) => {
    try {
      const [rawGuilds, botIds] = await Promise.all([
        fetchUserGuilds(accessToken),
        fetchBotGuildIds(),
      ]);
      const filtered = filterManagedGuilds(rawGuilds, botIds);
      setGuilds(filtered);
    } catch {
      // If guild fetch fails, fall back to mock guilds
      setGuilds(MOCK_GUILDS);
    }
  };

  // ─── Mock login ─────────────────────────────────────────────────────────────
  const completeMockLogin = () => {
    setUser(MOCK_USER as DiscordUser);
    setIsLoggedIn(true);
    setGuilds(MOCK_GUILDS);
  };

  // ─── Login entry point ──────────────────────────────────────────────────────
  const login = async () => {
    if (loginMode === 'mock') {
      completeMockLogin();
      return;
    }

    // Trigger OAuth2 browser flow
    setIsAuthLoading(true);
    try {
      await promptAsync();
    } catch {
      setIsAuthLoading(false);
    }
    // Response handled in useEffect above
  };

  // ─── Logout ─────────────────────────────────────────────────────────────────
  const logout = async () => {
    await clearSession();
    setUser(null);
    setIsLoggedIn(false);
    setSelectedGuild(null);
    setQueueState(null);
    setStats(null);
    setGuilds([]);
  };

  // ─── Bot data polling ────────────────────────────────────────────────────────
  const loadData = useCallback(async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    try {
      const [statsData, guildsData] = await Promise.all([
        fetchBotStats(),
        fetchGuilds(),
      ]);
      setStats(statsData);

      // Merge bot status into OAuth guild list
      setGuilds(prev => {
        if (prev.length === 0) return guildsData;
        return prev.map(g => {
          const live = guildsData.find(lg => lg.id === g.id);
          return live ? { ...g, ...live } : g;
        });
      });

      if (selectedGuild) {
        const queue = await fetchQueue(selectedGuild.id);
        setQueueState(queue);
      }
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedGuild]);

  useEffect(() => {
    if (isLoggedIn) {
      loadData();
      pollRef.current = setInterval(() => loadData(), 10000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [isLoggedIn, loadData]);

  // ─── Guild select ────────────────────────────────────────────────────────────
  const selectGuild = async (guild: BotGuild) => {
    setSelectedGuild(guild);
    if (guild.botPresent) {
      const queue = await fetchQueue(guild.id);
      setQueueState(queue);
    }
  };

  const refreshAll = async () => { await loadData(true); };

  const updateQueueState = (updates: Partial<QueueState>) => {
    setQueueState(prev => prev ? { ...prev, ...updates } : null);
  };

  const updateGuild = (guildId: string, updates: Partial<BotGuild>) => {
    setGuilds(prev => prev.map(g => g.id === guildId ? { ...g, ...updates } : g));
    if (selectedGuild?.id === guildId) {
      setSelectedGuild(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  return (
    <BotContext.Provider value={{
      user, isLoggedIn, isAuthLoading, loginMode,
      stats, guilds, selectedGuild, queueState,
      isLoading, isRefreshing,
      login, logout, selectGuild, refreshAll,
      updateQueueState, updateGuild,
    }}>
      {children}
    </BotContext.Provider>
  );
}
