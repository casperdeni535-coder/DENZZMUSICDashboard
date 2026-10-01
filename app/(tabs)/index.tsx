import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Header, StatsGrid, GlassCard, StatusBadge } from '@/components';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { useBot } from '@/hooks/useBot';

export default function DashboardScreen() {
  const { stats, guilds, selectedGuild, isLoading, isRefreshing, refreshAll } = useBot();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading bot data...</Text>
      </View>
    );
  }

  const playingGuilds = guilds.filter(g => g.isPlaying);
  const mode247Guilds = guilds.filter(g => g.mode247);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Header />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshAll}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        {/* Hero Status */}
        <GlassCard strong style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View style={styles.heroBotInfo}>
              <Image
                source={require('@/assets/images/denzzmusic-logo.png')}
                style={styles.heroBotAvatar}
                contentFit="contain"
              />
              <View>
                <Text style={styles.heroBotName}>DENZZMUSIC</Text>
                <Text style={styles.heroBotId}>Discord Music Bot</Text>
              </View>
            </View>
            {stats ? (
              <StatusBadge status={stats.status === 'online' ? 'online' : 'offline'} />
            ) : null}
          </View>

          {stats ? (
            <View style={styles.pingRow}>
              <MaterialIcons name="signal-wifi-4-bar" size={14} color={Colors.success} />
              <Text style={styles.pingText}>{stats.ping}ms · {stats.guilds} servers · {stats.activeVoice} active VC</Text>
            </View>
          ) : null}
        </GlassCard>

        {/* Stats */}
        {stats ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bot Statistics</Text>
            <StatsGrid stats={stats} />
          </View>
        ) : null}

        {/* Now Playing */}
        {playingGuilds.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <MaterialIcons name="graphic-eq" size={16} color={Colors.primaryLight} /> Now Playing
            </Text>
            {playingGuilds.map(guild => (
              <GlassCard key={guild.id} style={styles.nowPlayingCard}>
                <View style={styles.npRow}>
                  <View style={styles.npGuild}>
                    <Text style={styles.npGuildName}>{guild.name}</Text>
                    <View style={styles.npMeta}>
                      <MaterialIcons name="volume-up" size={12} color={Colors.textMuted} />
                      <Text style={styles.npMetaText}>{guild.voiceChannelName}</Text>
                    </View>
                  </View>
                  <StatusBadge status="playing" size="sm" />
                </View>
                {guild.currentTrack ? (
                  <View style={styles.npTrack}>
                    <Image
                      source={{ uri: guild.currentTrack.thumbnail }}
                      style={styles.npThumb}
                      contentFit="cover"
                      transition={200}
                    />
                    <View style={styles.npTrackInfo}>
                      <Text style={styles.npTitle} numberOfLines={1}>{guild.currentTrack.title}</Text>
                      <Text style={styles.npArtist} numberOfLines={1}>{guild.currentTrack.author}</Text>
                    </View>
                  </View>
                ) : null}
              </GlassCard>
            ))}
          </View>
        ) : null}

        {/* 24/7 Active */}
        {mode247Guilds.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <MaterialIcons name="all-inclusive" size={16} color={Colors.primaryLight} /> 24/7 Mode Active
            </Text>
            {mode247Guilds.map(g => (
              <GlassCard key={g.id} style={styles.mode247Card}>
                <View style={styles.mode247Row}>
                  <MaterialIcons name="all-inclusive" size={18} color={Colors.primaryLight} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.mode247Name}>{g.name}</Text>
                    {g.voiceChannelName ? (
                      <Text style={styles.mode247Ch}>{g.voiceChannelName}</Text>
                    ) : null}
                  </View>
                  <StatusBadge status="247" size="sm" />
                </View>
              </GlassCard>
            ))}
          </View>
        ) : null}

        {/* Commands Reference */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Slash Commands</Text>
          <GlassCard>
            <View style={styles.cmdGrid}>
              {['/play', '/pause', '/resume', '/skip', '/stop',
                '/queue', '/loop', '/shuffle', '/volume', '/247'].map(cmd => (
                <View key={cmd} style={styles.cmdChip}>
                  <Text style={styles.cmdText}>{cmd}</Text>
                </View>
              ))}
            </View>
          </GlassCard>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>DENZZMUSIC — Discord Music Bot 24/7</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  loading: { flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  loadingText: { color: Colors.textSecondary, fontSize: FontSize.md },
  scroll: { flex: 1 },
  content: { padding: Spacing.md, gap: Spacing.md, paddingBottom: Spacing.xxl },

  heroCard: { gap: Spacing.sm },
  heroRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroBotInfo: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  heroBotAvatar: { width: 44, height: 44, borderRadius: 12 },
  heroBotName: { color: Colors.textPrimary, fontSize: FontSize.lg, fontWeight: FontWeight.bold, letterSpacing: 1 },
  heroBotId: { color: Colors.textMuted, fontSize: FontSize.xs },
  pingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pingText: { color: Colors.textMuted, fontSize: FontSize.xs },

  section: { gap: Spacing.sm },
  sectionTitle: {
    color: Colors.textSecondary, fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold, letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  nowPlayingCard: { gap: Spacing.sm },
  npRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  npGuild: { flex: 1 },
  npGuildName: { color: Colors.textPrimary, fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  npMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  npMetaText: { color: Colors.textMuted, fontSize: FontSize.xs },
  npTrack: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  npThumb: { width: 48, height: 48, borderRadius: Radius.sm },
  npTrackInfo: { flex: 1 },
  npTitle: { color: Colors.textPrimary, fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  npArtist: { color: Colors.textMuted, fontSize: FontSize.xs, marginTop: 2 },

  mode247Card: {},
  mode247Row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  mode247Name: { color: Colors.textPrimary, fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  mode247Ch: { color: Colors.textMuted, fontSize: FontSize.xs, marginTop: 2 },

  cmdGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  cmdChip: {
    backgroundColor: Colors.bgGlassStrong,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.sm, paddingHorizontal: Spacing.sm, paddingVertical: 6,
  },
  cmdText: { color: Colors.primaryLight, fontSize: FontSize.sm, fontWeight: FontWeight.medium, fontFamily: 'monospace' },

  footer: { paddingVertical: Spacing.lg, alignItems: 'center' },
  footerText: { color: Colors.textMuted, fontSize: FontSize.xs, letterSpacing: 0.5 },
});
