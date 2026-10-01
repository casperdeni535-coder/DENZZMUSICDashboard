import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  strong?: boolean;
  noPadding?: boolean;
}

export function GlassCard({ children, style, strong, noPadding }: GlassCardProps) {
  return (
    <View style={[
      styles.card,
      strong && styles.cardStrong,
      noPadding && styles.noPadding,
      style,
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgGlass,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  cardStrong: {
    backgroundColor: Colors.bgGlassStrong,
    borderColor: Colors.borderStrong,
  },
  noPadding: {
    padding: 0,
  },
});
