import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { Colors, Radius, Spacing, FontSize, FontWeight } from '@/constants/theme';

interface NeonButtonProps {
  onPress: () => void;
  label: string;
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function NeonButton({
  onPress, label, variant = 'primary', size = 'md',
  disabled, loading, style
}: NeonButtonProps) {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        variant === 'primary' && styles.primary,
        variant === 'ghost' && styles.ghost,
        variant === 'danger' && styles.danger,
        isSmall && styles.small,
        isLarge && styles.large,
        (disabled || loading) && styles.disabled,
        pressed && { opacity: 0.75, transform: [{ scale: 0.97 }] },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={Colors.textPrimary} />
      ) : (
        <Text style={[
          styles.label,
          isSmall && styles.labelSmall,
          isLarge && styles.labelLarge,
          variant === 'ghost' && styles.labelGhost,
          variant === 'danger' && styles.labelDanger,
        ]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  primary: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  },
  ghost: {
    backgroundColor: Colors.bgGlass,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
  },
  danger: {
    backgroundColor: 'rgba(229,57,53,0.15)',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  small: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    minHeight: 36,
  },
  large: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md - 2,
    minHeight: 52,
  },
  disabled: { opacity: 0.4 },
  label: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  labelSmall: { fontSize: FontSize.sm },
  labelLarge: { fontSize: FontSize.lg },
  labelGhost: { color: Colors.textSecondary },
  labelDanger: { color: Colors.primaryLight },
});
