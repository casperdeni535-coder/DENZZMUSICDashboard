import React from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Header, GlassCard, NeonButton, QueueItem } from '@/components';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { useBot } from '@/hooks/useBot';
import { usePlayer } from '@/hooks/usePlayer';
import { useAlert } from '@/template';

export default function QueueScreen() {
  const { selectedGuild, queueState } = useBot();
  const { handleRemoveTrack, handleClearQueue, handleToggleShuffle, handleSetLoop, isActing } = usePlayer();
  const { showAlert } = useAlert();

  if (!selectedGuild) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <Header title="Queue" />
        <View style={styles.center}>
          <MaterialIcons name="queue-music" size={56} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No Server Selected</Text>
          <Text style={styles.emptySub}>Select a server from the Servers tab</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!queueState || queueState.tracks.length === 0) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <Header title="Queue" />
        <View style={styles.center}>
          <MaterialIcons name="queue-music" size={56} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>Queue is empty</Text>
          <Text style={styles.emptySub}>Use /play in Discord or the Player tab to add songs</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleClear = () => {
    showAlert(
      'Clear Queue',
      'Are you sure you want to clear the entire queue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: handleClearQueue },
      ]
    );
  };

  const totalDuration = queueState.tracks.reduce((sum, t) => sum + t.duration, 0);
  const formatTotal = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Header title="Queue" />
      <View style={styles.container}>
        {/* Queue info bar */}
        <View style={styles.infoBar}>
          <View style={styles.infoStats}>
            <Text style={styles.infoCount}>{queueState.tracks.length} songs</Text>
            <Text style={styles.dot}>·</Text>
            <Text style={styles.infoTotal}>{formatTotal(totalDuration)}</Text>
            {queueState.loop !== 'off' ? (
              <>
                <Text style={styles.dot}>·</Text>
                <MaterialIcons name={queueState.loop === 'track' ? 'repeat-one' : 'repeat'} size={14} color={Colors.primaryLight} />
                <Text style={styles.infoLoop}>
                  {queueState.loop === 'track' ? 'Track' : 'Queue'}
                </Text>
              </>
            ) : null}
            {queueState.shuffle ? (
              <>
                <Text style={styles.dot}>·</Text>
                <MaterialIcons name="shuffle" size={14} color={Colors.primaryLight} />
              </>
            ) : null}
          </View>

          <NeonButton
            label="Clear All"
            onPress={handleClear}
            variant="danger"
            size="sm"
            disabled={isActing}
          />
        </View>

        {/* Track list */}
        <FlatList
          data={queueState.tracks}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <QueueItem
              track={item}
              index={index}
              isCurrent={index === queueState.currentIndex}
              onRemove={handleRemoveTrack}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, padding: Spacing.xl },
  emptyTitle: { color: Colors.textSecondary, fontSize: FontSize.xl, fontWeight: FontWeight.bold },
  emptySub: { color: Colors.textMuted, fontSize: FontSize.md, textAlign: 'center', lineHeight: 24 },

  infoBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  infoStats: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoCount: { color: Colors.textPrimary, fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  dot: { color: Colors.textMuted, fontSize: FontSize.sm },
  infoTotal: { color: Colors.textMuted, fontSize: FontSize.sm },
  infoLoop: { color: Colors.primaryLight, fontSize: FontSize.xs, fontWeight: FontWeight.medium },

  listContent: { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm, paddingBottom: Spacing.xxl },
  separator: { height: 4 },
});
