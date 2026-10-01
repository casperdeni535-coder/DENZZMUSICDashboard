import { useState, useCallback } from 'react';
import { useBot } from './useBot';
import {
  pausePlayback, resumePlayback, skipTrack, stopPlayback,
  setVolume, setLoop, toggleShuffle, removeTrack, clearQueue,
  playTrack, set247Mode,
} from '@/services/botApi';
import { LoopMode } from '@/types';

export function usePlayer() {
  const { selectedGuild, queueState, updateQueueState, updateGuild } = useBot();
  const [isActing, setIsActing] = useState(false);

  const guildId = selectedGuild?.id || '';

  const act = useCallback(async (fn: () => Promise<any>) => {
    if (!guildId) return;
    setIsActing(true);
    try {
      await fn();
    } finally {
      setIsActing(false);
    }
  }, [guildId]);

  const handlePause = useCallback(() => act(async () => {
    await pausePlayback(guildId);
    updateQueueState({ isPaused: true, isPlaying: false });
  }), [act, guildId]);

  const handleResume = useCallback(() => act(async () => {
    await resumePlayback(guildId);
    updateQueueState({ isPaused: false, isPlaying: true });
  }), [act, guildId]);

  const handleSkip = useCallback(() => act(async () => {
    await skipTrack(guildId);
    if (queueState && queueState.tracks.length > 1) {
      const nextIndex = (queueState.currentIndex + 1) % queueState.tracks.length;
      updateQueueState({
        currentIndex: nextIndex,
        currentTrack: queueState.tracks[nextIndex],
        progress: 0,
        isPlaying: true,
        isPaused: false,
      });
    }
  }), [act, guildId, queueState]);

  const handleStop = useCallback(() => act(async () => {
    await stopPlayback(guildId);
    updateQueueState({ isPlaying: false, isPaused: false, progress: 0 });
  }), [act, guildId]);

  const handleSetVolume = useCallback((vol: number) => act(async () => {
    await setVolume(guildId, vol);
    updateQueueState({ volume: vol });
  }), [act, guildId]);

  const handleSetLoop = useCallback((mode: LoopMode) => act(async () => {
    await setLoop(guildId, mode);
    updateQueueState({ loop: mode });
  }), [act, guildId]);

  const handleToggleShuffle = useCallback(() => act(async () => {
    await toggleShuffle(guildId);
    updateQueueState({ shuffle: !queueState?.shuffle });
  }), [act, guildId, queueState]);

  const handleRemoveTrack = useCallback((index: number) => act(async () => {
    await removeTrack(guildId, index);
    if (queueState) {
      const newTracks = [...queueState.tracks];
      newTracks.splice(index, 1);
      updateQueueState({ tracks: newTracks });
    }
  }), [act, guildId, queueState]);

  const handleClearQueue = useCallback(() => act(async () => {
    await clearQueue(guildId);
    updateQueueState({ tracks: [], currentTrack: null, isPlaying: false });
  }), [act, guildId]);

  const handlePlay = useCallback(async (query: string) => {
    if (!guildId) return null;
    setIsActing(true);
    try {
      const track = await playTrack(guildId, query);
      if (track && queueState) {
        updateQueueState({
          tracks: [...queueState.tracks, track],
          currentTrack: queueState.currentTrack || track,
          isPlaying: true,
        });
      }
      return track;
    } finally {
      setIsActing(false);
    }
  }, [guildId, queueState]);

  const handleToggle247 = useCallback((enabled: boolean) => act(async () => {
    await set247Mode(guildId, enabled);
    updateGuild(guildId, { mode247: enabled });
  }), [act, guildId]);

  return {
    queueState,
    isActing,
    handlePause,
    handleResume,
    handleSkip,
    handleStop,
    handleSetVolume,
    handleSetLoop,
    handleToggleShuffle,
    handleRemoveTrack,
    handleClearQueue,
    handlePlay,
    handleToggle247,
  };
}
