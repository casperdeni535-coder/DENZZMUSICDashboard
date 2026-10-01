import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius } from '@/constants/theme';

interface IconButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'primary' | 'surface';
  style?: ViewStyle;
  disabled?: boolean;
}

export function IconButton({ onPress, children, size = 'md', variant = 'ghost', style, disabled }: IconButtonProps) {
  const dim = size === 'sm' ? 36 : size === 'lg' ? 56 : 44;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={({ pressed }) => [
        styles.btn,
        { width: dim, height: dim, borderRadius: dim / 2 },
        variant === 'primary' && styles.primary,
        variant === 'surface' && styles.surface,
        disabled && styles.disabled,
        pressed && { opacity: 0.65, transform: [{ scale: 0.93 }] },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 4,
  },
  surface: {
    backgroundColor: Colors.bgGlassStrong,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  disabled: { opacity: 0.4 },
});
