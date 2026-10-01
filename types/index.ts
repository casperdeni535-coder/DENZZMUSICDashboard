export interface Track {
  id: string;
  title: string;
  author: string;
  url: string;
  thumbnail: string;
  duration: number; // seconds
  durationFormatted: string;
  requestedBy: string;
  requestedByAvatar?: string;
  source: 'youtube' | 'spotify' | 'soundcloud';
}

export interface QueueState {
  tracks: Track[];
  currentIndex: number;
  currentTrack: Track | null;
  isPlaying: boolean;
  isPaused: boolean;
  loop: 'off' | 'track' | 'queue';
  shuffle: boolean;
  volume: number; // 0-100
  progress: number; // seconds
  timestamp: number;
}

export interface BotGuild {
  id: string;
  name: string;
  icon: string | null;
  memberCount: number;
  botPresent: boolean;
  voiceChannel: string | null;
  voiceChannelName: string | null;
  mode247: boolean;
  isPlaying: boolean;
  currentTrack: Track | null;
}

export interface BotStats {
  uptime: number; // seconds
  guilds: number;
  activeVoice: number;
  tracksPlayed: number;
  cpuUsage: number;
  memoryUsage: number;
  memoryTotal: number;
  ping: number;
  status: 'online' | 'offline' | 'idle';
}

export interface VoiceChannel {
  id: string;
  name: string;
  members: number;
}

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  email?: string;
  accessToken?: string;
}

export type LoopMode = 'off' | 'track' | 'queue';
