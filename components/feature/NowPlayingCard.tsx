import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { GlassCard } from '@/components/ui/GlassCard';
import { IconButton } from '@/components/ui/IconButton';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { QueueState } from '@/types';

interface NowPlayingCardProps {
  queueState: QueueState;
  onPause: () => void;
  onResume: () => void;
  onSkip: () => void;
  onStop: () => void;
  isActing: boolean;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function NowPlayingCard({ queueState, onPause, onResume, onSkip, onStop, isActing }: NowPlayingCardProps) {
  const { currentTrack, isPlaying, isPaused, progress, volume } = queueState;
  const [displayProgress, setDisplayProgress] = useState(progress);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setDisplayProgress(progress);
  }, [progress]);

  useEffect(() => {
    if (isPlaying && !isPaused) {
      tickRef.current = setInterval(() => {
        setDisplayProgress(p => {
          if (!currentTrack) return p;
          return Math.min(p + 1, currentTrack.duration);
        });
      }, 1000);
    }
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [isPlaying, isPaused, currentTrack]);

  useEffect(() => {
    if (isPlaying && !isPaused) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.03, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isPlaying, isPaused]);

  if (!currentTrack) {
    return (
      <GlassCard style={styles.emptyCard}>
        <MaterialIcons name="music-off" size={48} color={Colors.textMuted} />
        <Text style={styles.emptyTitle}>No song playing</Text>
        <Text style={styles.emptySubtitle}>Use /play in Discord to start music</Text>
      </GlassCard>
    );
  }

  const progressPercent = currentTrack.duration > 0 ? (displayProgress / currentTrack.duration) * 100 : 0;

  return (
    <GlassCard style={styles.card} noPadding>
      {/* Artwork */}
      <Animated.View style={[styles.artworkContainer, { transform: [{ scale: pulseAnim }] }]}>
        <Image
          source={{ uri: currentTrack.thumbnail }}
          style={styles.artwork}
          contentFit="cover"
          transition={400}
        />
        <View style={styles.artworkOverlay} />
        {isPlaying && !isPaused && (
          <View style={styles.playingIndicator}>
            <View style={[styles.bar, styles.bar1]} />
            <View style={[styles.bar, styles.bar2]} />
            <View style={[styles.bar, styles.bar3]} />
          </View>
        )}
      </Animated.View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <View style={styles.titleRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.songTitle} numberOfLines={1}>{currentTrack.title}</Text>
            <Text style={styles.artistName} numberOfLines={1}>{currentTrack.author}</Text>
          </View>
          <View style={styles.sourceBadge}>
            <MaterialIcons
              name={currentTrack.source === 'spotify' ? 'music-note' : 'play-circle-outline'}
              size={14}
              color={Colors.textMuted}
            />
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            <View style={[styles.progressThumb, { left: `${progressPercent}%` as any }]} />
          </View>
          <View style={styles.progressTimes}>
            <Text style={styles.timeText}>{formatTime(displayProgress)}</Text>
            <Text style={styles.timeText}>{currentTrack.durationFormatted}</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <IconButton onPress={onStop} size="sm" variant="surface" disabled={isActing}>
            <MaterialIcons name="stop" size={18} color={Colors.textSecondary} />
          </IconButton>

          <IconButton
            onPress={isPaused ? onResume : onPause}
            size="lg"
            variant="primary"
            disabled={isActing}
          >
            <MaterialIcons
              name={isPaused ? 'play-arrow' : 'pause'}
              size={28}
              color={Colors.textPrimary}
            />
          </IconButton>

          <IconButton onPress={onSkip} size="sm" variant="surface" disabled={isActing}>
            <MaterialIcons name="skip-next" size={22} color={Colors.textSecondary} />
          </IconButton>
        </View>

        {/* Requested by */}
        <View style={styles.requestedRow}>
          <MaterialIcons name="person" size={12} color={Colors.textMuted} />
          <Text style={styles.requestedText}>Requested by {currentTrack.requestedBy}</Text>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { overflow: 'hidden' },
  emptyCard: { alignItems: 'center', paddingVertical: 40, gap: Spacing.sm },
  emptyTitle: { color: Colors.textSecondary, fontSize: FontSize.lg, fontWeight: FontWeight.semibold },
  emptySubtitle: { color: Colors.textMuted, fontSize: FontSize.sm, textAlign: 'center' },

  artworkContainer: { position: 'relative' },
  artwork: { width: '100%', height: 220 },
  artworkOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  playingIndicator: {
    position: 'absolute', top: 12, right: 12,
    flexDirection: 'row', alignItems: 'flex-end', gap: 3,
  },
  bar: {
    width: 3, borderRadius: 2,
    backgroundColor: Colors.primaryLight,
  },
  bar1: { height: 12 },
  bar2: { height: 20 },
  bar3: { height: 16 },

  infoContainer: { padding: Spacing.md, gap: Spacing.sm },

  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  titleBlock: { flex: 1 },
  songTitle: {
    color: Colors.textPrimary, fontSize: FontSize.xl,
    fontWeight: FontWeight.bold, lineHeight: 28,
  },
  artistName: { color: Colors.textSecondary, fontSize: FontSize.md, marginTop: 2 },
  sourceBadge: {
    backgroundColor: Colors.bgGlassStrong, borderRadius: Radius.sm,
    padding: 6, borderWidth: 1, borderColor: Colors.border,
  },

  progressContainer: { gap: Spacing.xs },
  progressTrack: {
    height: 4, backgroundColor: Colors.bgGlassStrong,
    borderRadius: 2, overflow: 'hidden', position: 'relative',
  },
  progressFill: {
    position: 'absolute', left: 0, top: 0, bottom: 0,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8, shadowRadius: 4,
  },
  progressThumb: {
    position: 'absolute', top: -4,
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: Colors.textPrimary,
    marginLeft: -6,
  },
  progressTimes: { flexDirection: 'row', justifyContent: 'space-between' },
  timeText: { color: Colors.textMuted, fontSize: FontSize.xs },

  controls: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },

  requestedRow: { flexDirection: 'row', alignItems: 'center', gap: 4, justifyContent: 'center' },
  requestedText: { color: Colors.textMuted, fontSize: FontSize.xs },
});
