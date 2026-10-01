import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { Track } from '@/types';

interface QueueItemProps {
  track: Track;
  index: number;
  isCurrent?: boolean;
  onRemove: (index: number) => void;
}

export function QueueItem({ track, index, isCurrent, onRemove }: QueueItemProps) {
  return (
    <View style={[styles.container, isCurrent && styles.containerActive]}>
      {isCurrent ? (
        <View style={styles.indexActive}>
          <MaterialIcons name="graphic-eq" size={16} color={Colors.primaryLight} />
        </View>
      ) : (
        <Text style={styles.index}>{index + 1}</Text>
      )}

      <Image
        source={{ uri: track.thumbnail }}
        style={styles.thumb}
        contentFit="cover"
        transition={200}
      />

      <View style={styles.info}>
        <Text style={[styles.title, isCurrent && styles.titleActive]} numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>{track.author}</Text>
      </View>

      <Text style={styles.duration}>{track.durationFormatted}</Text>

      {!isCurrent && (
        <Pressable
          onPress={() => onRemove(index)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={({ pressed }) => [styles.removeBtn, pressed && { opacity: 0.6 }]}
        >
          <MaterialIcons name="close" size={16} color={Colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    gap: Spacing.sm,
  },
  containerActive: {
    backgroundColor: Colors.bgGlassStrong,
    borderWidth: 1,
    borderColor: 'rgba(229,57,53,0.2)',
  },
  index: {
    color: Colors.textMuted, fontSize: FontSize.sm,
    width: 20, textAlign: 'center',
  },
  indexActive: { width: 20, alignItems: 'center' },
  thumb: { width: 44, height: 44, borderRadius: Radius.sm },
  info: { flex: 1 },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  titleActive: { color: Colors.primaryLight, fontWeight: FontWeight.semibold },
  author: { color: Colors.textMuted, fontSize: FontSize.xs, marginTop: 2 },
  duration: { color: Colors.textMuted, fontSize: FontSize.xs },
  removeBtn: { padding: 4 },
});
