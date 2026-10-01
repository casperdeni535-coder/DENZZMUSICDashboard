import { QueueState, BotStats, BotGuild, Track } from '@/types';
import {
  MOCK_QUEUE_STATE,
  MOCK_BOT_STATS,
  MOCK_GUILDS,
  MOCK_TRACKS,
} from './mockData';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Bot Stats ────────────────────────────────────────────────────────────────
export async function fetchBotStats(): Promise<BotStats> {
  await delay(300);
  return {
    ...MOCK_BOT_STATS,
    uptime: MOCK_BOT_STATS.uptime + Math.floor(Math.random() * 60),
    ping: Math.floor(40 + Math.random() * 20),
    cpuUsage: parseFloat((10 + Math.random() * 10).toFixed(1)),
  };
}

// ─── Guilds ───────────────────────────────────────────────────────────────────
export async function fetchGuilds(): Promise<BotGuild[]> {
  await delay(400);
  return MOCK_GUILDS;
}

export async function fetchGuild(guildId: string): Promise<BotGuild | null> {
  await delay(200);
  return MOCK_GUILDS.find(g => g.id === guildId) || null;
}

// ─── Queue ────────────────────────────────────────────────────────────────────
export async function fetchQueue(guildId: string): Promise<QueueState> {
  await delay(300);
  return MOCK_QUEUE_STATE;
}

// ─── Playback Controls ────────────────────────────────────────────────────────
export async function playTrack(guildId: string, query: string): Promise<Track | null> {
  await delay(600);
  const fakeTrack: Track = {
    id: Date.now().toString(),
    title: query,
    author: 'Unknown Artist',
    url: '',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
    duration: 180,
    durationFormatted: '3:00',
    requestedBy: 'You',
    source: 'youtube',
  };
  return fakeTrack;
}

export async function pausePlayback(guildId: string): Promise<boolean> {
  await delay(150);
  return true;
}

export async function resumePlayback(guildId: string): Promise<boolean> {
  await delay(150);
  return true;
}

export async function skipTrack(guildId: string): Promise<boolean> {
  await delay(200);
  return true;
}

export async function stopPlayback(guildId: string): Promise<boolean> {
  await delay(200);
  return true;
}

export async function setVolume(guildId: string, volume: number): Promise<boolean> {
  await delay(100);
  return true;
}

export async function setLoop(guildId: string, mode: 'off' | 'track' | 'queue'): Promise<boolean> {
  await delay(100);
  return true;
}

export async function toggleShuffle(guildId: string): Promise<boolean> {
  await delay(100);
  return true;
}

export async function removeTrack(guildId: string, index: number): Promise<boolean> {
  await delay(200);
  return true;
}

export async function clearQueue(guildId: string): Promise<boolean> {
  await delay(200);
  return true;
}

// ─── 24/7 Mode ────────────────────────────────────────────────────────────────
export async function set247Mode(guildId: string, enabled: boolean): Promise<boolean> {
  await delay(300);
  return true;
}

// ─── Voice ────────────────────────────────────────────────────────────────────
export async function joinChannel(guildId: string, channelId: string): Promise<boolean> {
  await delay(400);
  return true;
}

export async function leaveChannel(guildId: string): Promise<boolean> {
  await delay(300);
  return true;
}
