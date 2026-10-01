import React, { createContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import { QueueState, BotStats, BotGuild, DiscordUser } from '@/types';
import { fetchBotStats, fetchQueue, fetchGuilds } from '@/services/botApi';
import { MOCK_USER } from '@/services/mockData';

interface BotContextType {
  user: DiscordUser | null;
  isLoggedIn: boolean;
  stats: BotStats | null;
  guilds: BotGuild[];
  selectedGuild: BotGuild | null;
  queueState: QueueState | null;
  isLoading: boolean;
  isRefreshing: boolean;
  login: () => void;
  logout: () => void;
  selectGuild: (guild: BotGuild) => void;
  refreshAll: () => Promise<void>;
  updateQueueState: (state: Partial<QueueState>) => void;
  updateGuild: (guildId: string, updates: Partial<BotGuild>) => void;
}

export const BotContext = createContext<BotContextType | undefined>(undefined);

export function BotProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stats, setStats] = useState<BotStats | null>(null);
  const [guilds, setGuilds] = useState<BotGuild[]>([]);
  const [selectedGuild, setSelectedGuild] = useState<BotGuild | null>(null);
  const [queueState, setQueueState] = useState<QueueState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadData = useCallback(async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    try {
      const [statsData, guildsData] = await Promise.all([
        fetchBotStats(),
        fetchGuilds(),
      ]);
      setStats(statsData);
      setGuilds(guildsData);

      if (selectedGuild) {
        const queue = await fetchQueue(selectedGuild.id);
        setQueueState(queue);
      }
    } catch (e) {
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

  const login = () => {
    setUser(MOCK_USER as DiscordUser);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setSelectedGuild(null);
    setQueueState(null);
    setStats(null);
    setGuilds([]);
  };

  const selectGuild = async (guild: BotGuild) => {
    setSelectedGuild(guild);
    if (guild.botPresent) {
      const queue = await fetchQueue(guild.id);
      setQueueState(queue);
    }
  };

  const refreshAll = async () => {
    await loadData(true);
  };

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
      user, isLoggedIn, stats, guilds, selectedGuild, queueState,
      isLoading, isRefreshing, login, logout, selectGuild, refreshAll,
      updateQueueState, updateGuild,
    }}>
      {children}
    </BotContext.Provider>
  );
}
