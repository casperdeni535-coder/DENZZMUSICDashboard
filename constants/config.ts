export const APP_NAME = 'DENZZMUSIC';
export const APP_VERSION = '1.0.0';

// ─── Discord OAuth2 ───────────────────────────────────────────────────────────
// Set EXPO_PUBLIC_DISCORD_CLIENT_ID in your .env to enable real OAuth login.
// Leave blank to use mock/demo mode.
export const DISCORD_CLIENT_ID = process.env.EXPO_PUBLIC_DISCORD_CLIENT_ID ?? '';

// Deep-link scheme used as redirect URI (must match app.json scheme + Discord app settings)
// Scheme: denzzmusic  →  Redirect URI registered in Discord: denzzmusic://oauth
export const DISCORD_REDIRECT_SCHEME = 'denzzmusic';

// ─── Bot API ──────────────────────────────────────────────────────────────────
// Replace with your deployed Node.js bot URL (Render / Railway / VPS).
// The bot API must expose:
//   GET  /guilds/ids               → string[] of guild IDs the bot is in
//   POST /auth/discord/exchange    → { code, code_verifier, redirect_uri } → { access_token }
//   GET  /stats                    → BotStats
//   GET  /queue/:guildId           → QueueState
//   + all playback control endpoints
export const BOT_API_URL = process.env.EXPO_PUBLIC_BOT_API_URL ?? '';
export const DASHBOARD_WS_URL = process.env.EXPO_PUBLIC_WS_URL ?? '';

// ─── Links ────────────────────────────────────────────────────────────────────
export const BOT_INVITE_URL =
  `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID || 'YOUR_CLIENT_ID'}&permissions=8&scope=bot%20applications.commands`;
export const SUPPORT_SERVER = 'https://discord.gg/denzzmusic';
export const GITHUB_URL = 'https://github.com/denzzmusic';
