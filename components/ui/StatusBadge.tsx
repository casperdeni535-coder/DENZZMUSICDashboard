import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Radius, Spacing, FontWeight } from '@/constants/theme';

interface StatusBadgeProps {
  status: 'online' | 'offline' | 'playing' | 'idle' | '247';
  size?: 'sm' | 'md';
}

const STATUS_CONFIG = {
  online: { color: Colors.online, label: 'Online' },
  offline: { color: Colors.offline, label: 'Offline' },
  playing: { color: Colors.primary, label: 'Playing' },
  idle: { color: Colors.idle, label: 'Idle' },
  '247': { color: Colors.primaryLight, label: '24/7' },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const isSmall = size === 'sm';

  return (
    <View style={[styles.badge, { backgroundColor: `${config.color}22`, borderColor: `${config.color}44` }]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.label, { color: config.color, fontSize: isSmall ? FontSize.xs : FontSize.sm }]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.5,
  },
});
