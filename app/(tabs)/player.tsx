import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TextInput,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Header, NowPlayingCard, PlayerControls, GlassCard, NeonButton } from '@/components';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { useBot } from '@/hooks/useBot';
import { usePlayer } from '@/hooks/usePlayer';
import { useAlert } from '@/template';

export default function PlayerScreen() {
  const { selectedGuild } = useBot();
  const {
    queueState, isActing,
    handlePause, handleResume, handleSkip, handleStop,
    handleSetVolume, handleSetLoop, handleToggleShuffle,
    handlePlay, handleToggle247,
  } = usePlayer();
  const { showAlert } = useAlert();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  if (!selectedGuild) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <Header title="Player" />
        <View style={styles.noGuild}>
          <MaterialIcons name="dns" size={56} color={Colors.textMuted} />
          <Text style={styles.noGuildTitle}>No Server Selected</Text>
          <Text style={styles.noGuildSub}>Go to Servers tab and select a Discord server first</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handlePlaySubmit = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    const track = await handlePlay(query.trim());
    setIsSearching(false);
    if (track) {
      showAlert('Added to Queue', `"${track.title || query}" has been added to the queue.`);
      setQuery('');
    } else {
      showAlert('Error', 'Failed to play track. Make sure the bot is in a voice channel.');
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Header title="Player" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Server indicator */}
          <View style={styles.serverBadge}>
            <MaterialIcons name="dns" size={14} color={Colors.primary} />
            <Text style={styles.serverName}>{selectedGuild.name}</Text>
            {selectedGuild.voiceChannelName ? (
              <>
                <MaterialIcons name="chevron-right" size={14} color={Colors.textMuted} />
                <MaterialIcons name="volume-up" size={14} color={Colors.textMuted} />
                <Text style={styles.channelName}>{selectedGuild.voiceChannelName}</Text>
              </>
            ) : null}
          </View>

          {/* Now Playing */}
          {queueState ? (
            <NowPlayingCard
              queueState={queueState}
              onPause={handlePause}
              onResume={handleResume}
              onSkip={handleSkip}
              onStop={handleStop}
              isActing={isActing}
            />
          ) : (
            <GlassCard style={styles.emptyPlayer}>
              <MaterialIcons name="music-off" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>Nothing playing</Text>
              <Text style={styles.emptySub}>Use the search below to play music</Text>
            </GlassCard>
          )}

          {/* Controls */}
          {queueState ? (
            <PlayerControls
              queueState={queueState}
              onSetLoop={handleSetLoop}
              onToggleShuffle={handleToggleShuffle}
              onSetVolume={handleSetVolume}
              isActing={isActing}
            />
          ) : null}

          {/* Play input */}
          <GlassCard style={styles.searchCard}>
            <Text style={styles.searchLabel}>
              <MaterialIcons name="search" size={14} color={Colors.textSecondary} /> Play a Song
            </Text>
            <View style={styles.searchRow}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search or paste YouTube/Spotify URL..."
                placeholderTextColor={Colors.textMuted}
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handlePlaySubmit}
                returnKeyType="search"
                selectionColor={Colors.primary}
              />
              <NeonButton
                label="Play"
                onPress={handlePlaySubmit}
                loading={isSearching}
                disabled={!query.trim()}
                size="sm"
                style={styles.playBtn}
              />
            </View>
          </GlassCard>

          {/* 24/7 Toggle */}
          <GlassCard style={styles.mode247Card}>
            <View style={styles.mode247Row}>
              <View style={styles.mode247Info}>
                <MaterialIcons name="all-inclusive" size={22} color={selectedGuild.mode247 ? Colors.primaryLight : Colors.textMuted} />
                <View>
                  <Text style={styles.mode247Title}>24/7 Mode</Text>
                  <Text style={styles.mode247Sub}>
                    {selectedGuild.mode247 ? 'Bot stays in VC forever · Auto-reconnect active' : 'Bot leaves after queue ends'}
                  </Text>
                </View>
              </View>
              <NeonButton
                label={selectedGuild.mode247 ? 'ON' : 'OFF'}
                onPress={() => handleToggle247(!selectedGuild.mode247)}
                variant={selectedGuild.mode247 ? 'primary' : 'ghost'}
                size="sm"
                disabled={isActing}
              />
            </View>
          </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { padding: Spacing.md, gap: Spacing.md, paddingBottom: Spacing.xxl },

  noGuild: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, padding: Spacing.xl },
  noGuildTitle: { color: Colors.textSecondary, fontSize: FontSize.xl, fontWeight: FontWeight.bold },
  noGuildSub: { color: Colors.textMuted, fontSize: FontSize.md, textAlign: 'center', lineHeight: 24 },

  serverBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.bgGlass,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    alignSelf: 'flex-start',
  },
  serverName: { color: Colors.textPrimary, fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  channelName: { color: Colors.textMuted, fontSize: FontSize.sm },

  emptyPlayer: { alignItems: 'center', paddingVertical: 48, gap: Spacing.sm },
  emptyTitle: { color: Colors.textSecondary, fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  emptySub: { color: Colors.textMuted, fontSize: FontSize.sm, textAlign: 'center' },

  searchCard: { gap: Spacing.sm },
  searchLabel: { color: Colors.textSecondary, fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  searchRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  searchInput: {
    flex: 1, backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.md, paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2, color: Colors.textPrimary,
    fontSize: FontSize.md, minHeight: 44,
  },
  playBtn: { minWidth: 64 },

  mode247Card: {},
  mode247Row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  mode247Info: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  mode247Title: { color: Colors.textPrimary, fontSize: FontSize.md, fontWeight: FontWeight.bold },
  mode247Sub: { color: Colors.textMuted, fontSize: FontSize.xs, marginTop: 2 },
});
