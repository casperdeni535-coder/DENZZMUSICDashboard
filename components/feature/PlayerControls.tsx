import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import { MaterialIcons } from '@expo/vector-icons';
import { GlassCard } from '@/components/ui/GlassCard';
import { IconButton } from '@/components/ui/IconButton';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { LoopMode, QueueState } from '@/types';

interface PlayerControlsProps {
  queueState: QueueState;
  onSetLoop: (mode: LoopMode) => void;
  onToggleShuffle: () => void;
  onSetVolume: (v: number) => void;
  isActing: boolean;
}

const LOOP_ICONS: Record<LoopMode, keyof typeof MaterialIcons.glyphMap> = {
  off: 'repeat',
  track: 'repeat-one',
  queue: 'repeat',
};

const LOOP_CYCLE: LoopMode[] = ['off', 'track', 'queue'];

export function PlayerControls({ queueState, onSetLoop, onToggleShuffle, onSetVolume, isActing }: PlayerControlsProps) {
  const { loop, shuffle, volume } = queueState;
  const [localVolume, setLocalVolume] = useState(volume);

  const cycleLoop = () => {
    const idx = LOOP_CYCLE.indexOf(loop);
    onSetLoop(LOOP_CYCLE[(idx + 1) % LOOP_CYCLE.length]);
  };

  const loopActive = loop !== 'off';
  const loopColor = loopActive ? Colors.primaryLight : Colors.textSecondary;

  return (
    <GlassCard style={styles.card}>
      {/* Mode row */}
      <View style={styles.modeRow}>
        <Pressable
          onPress={cycleLoop}
          disabled={isActing}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={({ pressed }) => [styles.modeBtn, pressed && { opacity: 0.6 }]}
        >
          <MaterialIcons name={LOOP_ICONS[loop]} size={22} color={loopColor} />
          <Text style={[styles.modeLabel, loopActive && { color: Colors.primaryLight }]}>
            {loop === 'off' ? 'Loop Off' : loop === 'track' ? 'Loop Track' : 'Loop Queue'}
          </Text>
        </Pressable>

        <Pressable
          onPress={onToggleShuffle}
          disabled={isActing}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={({ pressed }) => [styles.modeBtn, pressed && { opacity: 0.6 }]}
        >
          <MaterialIcons
            name="shuffle"
            size={22}
            color={shuffle ? Colors.primaryLight : Colors.textSecondary}
          />
          <Text style={[styles.modeLabel, shuffle && { color: Colors.primaryLight }]}>
            {shuffle ? 'Shuffle On' : 'Shuffle Off'}
          </Text>
        </Pressable>
      </View>

      {/* Volume */}
      <View style={styles.volumeRow}>
        <MaterialIcons name="volume-down" size={20} color={Colors.textMuted} />
        <View style={styles.sliderWrap}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={localVolume}
            onValueChange={setLocalVolume}
            onSlidingComplete={onSetVolume}
            minimumTrackTintColor={Colors.primary}
            maximumTrackTintColor={Colors.bgGlassStrong}
            thumbTintColor={Colors.textPrimary}
          />
        </View>
        <MaterialIcons name="volume-up" size={20} color={Colors.textMuted} />
        <Text style={styles.volumeText}>{Math.round(localVolume)}%</Text>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.md },
  modeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modeBtn: { alignItems: 'center', gap: 4 },
  modeLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sliderWrap: { flex: 1 },
  slider: { width: '100%', height: 40 },
  volumeText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    width: 36,
    textAlign: 'right',
    fontWeight: FontWeight.medium,
  },
});
