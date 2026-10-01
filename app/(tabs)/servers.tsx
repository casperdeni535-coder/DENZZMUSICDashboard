import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Header, GuildCard, GlassCard, NeonButton } from '@/components';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { useBot } from '@/hooks/useBot';
import { BotGuild } from '@/types';
import { useAlert } from '@/template';

export default function ServersScreen() {
  const { guilds, selectedGuild, selectGuild } = useBot();
  const { showAlert } = useAlert();
  const [search, setSearch] = useState('');

  const filtered = guilds.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (guild: BotGuild) => {
    if (!guild.botPresent) {
      showAlert(
        'Bot Not Present',
        `DENZZMUSIC is not in ${guild.name}. Invite the bot to this server first.`,
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }
    selectGuild(guild);
    showAlert('Server Selected', `Now controlling ${guild.name}`);
  };

  const totalServers = guilds.length;
  const botServers = guilds.filter(g => g.botPresent).length;
  const playingNow = guilds.filter(g => g.isPlaying).length;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Header title="Servers" />

      <View style={styles.container}>
        {/* Summary */}
        <View style={styles.summaryRow}>
          <GlassCard style={styles.summaryCard}>
            <Text style={styles.summaryVal}>{totalServers}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </GlassCard>
          <GlassCard style={styles.summaryCard}>
            <Text style={[styles.summaryVal, { color: Colors.success }]}>{botServers}</Text>
            <Text style={styles.summaryLabel}>With Bot</Text>
          </GlassCard>
          <GlassCard style={styles.summaryCard}>
            <Text style={[styles.summaryVal, { color: Colors.primaryLight }]}>{playingNow}</Text>
            <Text style={styles.summaryLabel}>Playing</Text>
          </GlassCard>
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <MaterialIcons name="search" size={18} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search servers..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
            selectionColor={Colors.primary}
          />
        </View>

        {selectedGuild ? (
          <View style={styles.selectedBanner}>
            <MaterialIcons name="check-circle" size={16} color={Colors.success} />
            <Text style={styles.selectedText}>Controlling: {selectedGuild.name}</Text>
          </View>
        ) : (
          <View style={styles.hintBanner}>
            <MaterialIcons name="info-outline" size={16} color={Colors.info} />
            <Text style={styles.hintText}>Tap a server to start controlling the bot</Text>
          </View>
        )}

        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <GuildCard
              guild={item}
              onSelect={handleSelect}
              isSelected={selectedGuild?.id === item.id}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
          ListEmptyComponent={() => (
            <View style={styles.emptyList}>
              <MaterialIcons name="search-off" size={40} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No servers found</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1, paddingTop: Spacing.sm },

  summaryRow: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.md, marginBottom: Spacing.sm },
  summaryCard: { flex: 1, alignItems: 'center', paddingVertical: Spacing.sm },
  summaryVal: { color: Colors.textPrimary, fontSize: FontSize.xxl, fontWeight: FontWeight.bold },
  summaryLabel: { color: Colors.textMuted, fontSize: FontSize.xs },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.lg, marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm, paddingLeft: Spacing.md,
  },
  searchIcon: { marginRight: Spacing.xs },
  searchInput: {
    flex: 1, color: Colors.textPrimary, fontSize: FontSize.md,
    paddingVertical: Spacing.sm + 2, paddingRight: Spacing.md,
    minHeight: 44,
  },

  selectedBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(67,181,129,0.1)',
    borderWidth: 1, borderColor: 'rgba(67,181,129,0.3)',
    borderRadius: Radius.md, marginHorizontal: Spacing.md,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  selectedText: { color: Colors.success, fontSize: FontSize.sm, fontWeight: FontWeight.medium },

  hintBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(33,150,243,0.1)',
    borderWidth: 1, borderColor: 'rgba(33,150,243,0.3)',
    borderRadius: Radius.md, marginHorizontal: Spacing.md,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  hintText: { color: Colors.info, fontSize: FontSize.sm },

  list: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xxl },
  emptyList: { alignItems: 'center', paddingVertical: 48, gap: Spacing.sm },
  emptyText: { color: Colors.textMuted, fontSize: FontSize.md },
});
