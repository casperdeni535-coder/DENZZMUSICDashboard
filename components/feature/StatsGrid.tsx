import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { BotStats } from '@/types';

interface StatCardProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
  color?: string;
}

function StatCard({ icon, label, value, color = Colors.primary }: StatCardProps) {
  return (
    <GlassCard style={styles.statCard}>
      <View style={[styles.iconWrap, { backgroundColor: `${color}22` }]}>
        <MaterialIcons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </GlassCard>
  );
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

interface StatsGridProps {
  stats: BotStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <View style={styles.grid}>
      <StatCard
        icon="dns"
        label="Servers"
        value={stats.guilds.toString()}
        color={Colors.primary}
      />
      <StatCard
        icon="headset"
        label="Active VC"
        value={stats.activeVoice.toString()}
        color={Colors.info}
      />
      <StatCard
        icon="timer"
        label="Uptime"
        value={formatUptime(stats.uptime)}
        color={Colors.success}
      />
      <StatCard
        icon="signal-wifi-4-bar"
        label="Ping"
        value={`${stats.ping}ms`}
        color={stats.ping < 100 ? Colors.success : Colors.warning}
      />
      <StatCard
        icon="memory"
        label="RAM"
        value={`${stats.memoryUsage}MB`}
        color={Colors.warning}
      />
      <StatCard
        icon="music-note"
        label="Played"
        value={stats.tracksPlayed.toLocaleString()}
        color={Colors.primaryLight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.md,
  },
  iconWrap: {
    width: 40, height: 40, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  statValue: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    textAlign: 'center',
  },
});
