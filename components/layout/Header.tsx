import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useBot } from '@/hooks/useBot';

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
}

export function Header({ showBack, onBack, title }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const { stats, user } = useBot();

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.sm }]}>
      {showBack ? (
        <Pressable
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
        >
          <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
      ) : (
        <View style={styles.logo}>
          <Image
            source={require('@/assets/images/denzzmusic-logo.png')}
            style={styles.logoImg}
            contentFit="contain"
          />
          <Text style={styles.logoText}>DENZZMUSIC</Text>
        </View>
      )}

      {title ? (
        <Text style={styles.title}>{title}</Text>
      ) : null}

      <View style={styles.right}>
        {stats ? (
          <StatusBadge status={stats.status === 'online' ? 'online' : 'offline'} size="sm" />
        ) : null}
        {user ? (
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarInitial}>{user.username[0].toUpperCase()}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  logo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoImg: { width: 28, height: 28 },
  logoText: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 1.5,
  },
  backBtn: { padding: 4 },
  title: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
  },
  right: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  avatarWrap: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitial: { color: Colors.textPrimary, fontSize: FontSize.sm, fontWeight: FontWeight.bold },
});
