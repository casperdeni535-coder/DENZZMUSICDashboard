import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { BotGuild } from '@/types';

interface GuildCardProps {
  guild: BotGuild;
  onSelect: (guild: BotGuild) => void;
  isSelected?: boolean;
}

function getGuildInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export function GuildCard({ guild, onSelect, isSelected }: GuildCardProps) {
  const initials = getGuildInitials(guild.name);
  const colors = ['#E53935', '#1E88E5', '#43A047', '#FB8C00', '#8E24AA', '#00ACC1'];
  const color = colors[guild.id.charCodeAt(0) % colors.length];

  return (
    <Pressable
      onPress={() => onSelect(guild)}
      style={({ pressed }) => [
        styles.card,
        isSelected && styles.cardSelected,
        !guild.botPresent && styles.cardDisabled,
        pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
      ]}
    >
      {/* Guild Icon */}
      <View style={[styles.iconWrap, { backgroundColor: `${color}33`, borderColor: `${color}55` }]}>
        <Text style={[styles.initials, { color }]}>{initials}</Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{guild.name}</Text>
        <View style={styles.meta}>
          <MaterialIcons name="people" size={12} color={Colors.textMuted} />
          <Text style={styles.metaText}>{guild.memberCount.toLocaleString()}</Text>
          {guild.voiceChannelName ? (
            <>
              <Text style={styles.dot}>·</Text>
              <MaterialIcons name="volume-up" size={12} color={Colors.textMuted} />
              <Text style={styles.metaText} numberOfLines={1}>{guild.voiceChannelName}</Text>
            </>
          ) : null}
        </View>
      </View>

      {/* Badges */}
      <View style={styles.badges}>
        {!guild.botPresent ? (
          <StatusBadge status="offline" size="sm" />
        ) : guild.isPlaying ? (
          <StatusBadge status="playing" size="sm" />
        ) : (
          <StatusBadge status="online" size="sm" />
        )}
        {guild.mode247 ? (
          <StatusBadge status="247" size="sm" />
        ) : null}
      </View>

      <MaterialIcons name="chevron-right" size={20} color={Colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgGlass,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  cardSelected: {
    borderColor: 'rgba(229,57,53,0.4)',
    backgroundColor: 'rgba(229,57,53,0.05)',
  },
  cardDisabled: { opacity: 0.5 },
  iconWrap: {
    width: 48, height: 48, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
  },
  initials: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  info: { flex: 1 },
  name: { color: Colors.textPrimary, fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3, flexWrap: 'wrap' },
  metaText: { color: Colors.textMuted, fontSize: FontSize.xs },
  dot: { color: Colors.textMuted, fontSize: FontSize.xs },
  badges: { flexDirection: 'column', gap: 4, alignItems: 'flex-end' },
});
