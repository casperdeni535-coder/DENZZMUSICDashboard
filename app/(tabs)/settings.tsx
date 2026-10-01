import React from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Header, GlassCard, NeonButton } from '@/components';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { useBot } from '@/hooks/useBot';
import { useAlert } from '@/template';
import { APP_VERSION, BOT_INVITE_URL, SUPPORT_SERVER, GITHUB_URL } from '@/constants/config';

function SettingRow({ icon, label, value, onPress, danger }: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
    >
      <View style={[styles.rowIcon, { backgroundColor: danger ? 'rgba(229,57,53,0.15)' : Colors.bgGlassStrong }]}>
        <MaterialIcons name={icon} size={18} color={danger ? Colors.primaryLight : Colors.textSecondary} />
      </View>
      <Text style={[styles.rowLabel, danger && { color: Colors.primaryLight }]}>{label}</Text>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      <MaterialIcons name="chevron-right" size={18} color={Colors.textMuted} />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { user, logout, stats, selectedGuild } = useBot();
  const { showAlert } = useAlert();

  const handleLogout = () => {
    showAlert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      showAlert('Error', 'Could not open link');
    });
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Header title="Settings" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile */}
        {user ? (
          <GlassCard strong style={styles.profileCard}>
            <View style={styles.profileAvatarWrap}>
              <Text style={styles.profileAvatarText}>
                {user.username[0].toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.username}</Text>
              <Text style={styles.profileTag}>#{user.discriminator}</Text>
              {user.email ? <Text style={styles.profileEmail}>{user.email}</Text> : null}
            </View>
            <View style={styles.discordBadge}>
              <MaterialIcons name="verified" size={20} color={Colors.info} />
            </View>
          </GlassCard>
        ) : null}

        {/* Bot Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bot Information</Text>
          <GlassCard style={styles.rowsCard}>
            <SettingRow icon="label" label="Version" value={`v${APP_VERSION}`} />
            <View style={styles.divider} />
            <SettingRow
              icon="signal-wifi-4-bar"
              label="Ping"
              value={stats ? `${stats.ping}ms` : 'N/A'}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="dns"
              label="Servers"
              value={stats ? `${stats.guilds}` : 'N/A'}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="memory"
              label="Memory"
              value={stats ? `${stats.memoryUsage}/${stats.memoryTotal}MB` : 'N/A'}
            />
          </GlassCard>
        </View>

        {/* Current Server */}
        {selectedGuild ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Server</Text>
            <GlassCard style={styles.rowsCard}>
              <SettingRow icon="dns" label="Server" value={selectedGuild.name} />
              <View style={styles.divider} />
              <SettingRow
                icon="all-inclusive"
                label="24/7 Mode"
                value={selectedGuild.mode247 ? 'Active' : 'Disabled'}
              />
              {selectedGuild.voiceChannelName ? (
                <>
                  <View style={styles.divider} />
                  <SettingRow
                    icon="volume-up"
                    label="Voice Channel"
                    value={selectedGuild.voiceChannelName}
                  />
                </>
              ) : null}
            </GlassCard>
          </View>
        ) : null}

        {/* Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>
          <GlassCard style={styles.rowsCard}>
            <SettingRow
              icon="add-circle-outline"
              label="Invite Bot"
              onPress={() => openLink(BOT_INVITE_URL)}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="forum"
              label="Support Server"
              onPress={() => openLink(SUPPORT_SERVER)}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="code"
              label="GitHub"
              onPress={() => openLink(GITHUB_URL)}
            />
          </GlassCard>
        </View>

        {/* Commands */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Commands</Text>
          <GlassCard>
            <View style={styles.cmdSection}>
              <Text style={styles.cmdCategoryLabel}>Slash Commands</Text>
              <View style={styles.cmdList}>
                {[
                  '/play <query>', '/pause', '/resume', '/skip', '/stop',
                  '/queue', '/nowplaying', '/loop', '/shuffle',
                  '/volume <0-100>', '/remove <number>', '/clear',
                  '/247 on', '/247 off', '/help',
                ].map(cmd => (
                  <View key={cmd} style={styles.cmdChip}>
                    <Text style={styles.cmdText}>{cmd}</Text>
                  </View>
                ))}
              </View>
              <Text style={[styles.cmdCategoryLabel, { marginTop: Spacing.md }]}>Prefix Commands (dm!)</Text>
              <View style={styles.cmdList}>
                {['dm!play', 'dm!skip', 'dm!queue', 'dm!stop', 'dm!pause'].map(cmd => (
                  <View key={cmd} style={[styles.cmdChip, styles.prefixChip]}>
                    <Text style={[styles.cmdText, styles.prefixText]}>{cmd}</Text>
                  </View>
                ))}
              </View>
            </View>
          </GlassCard>
        </View>

        {/* Logout */}
        <NeonButton
          label="Logout from Discord"
          onPress={handleLogout}
          variant="danger"
          style={styles.logoutBtn}
        />

        <Text style={styles.footer}>DENZZMUSIC — Discord Music Bot 24/7{'\n'}v{APP_VERSION}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { padding: Spacing.md, gap: Spacing.md, paddingBottom: Spacing.xxl },

  profileCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  profileAvatarWrap: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 15, elevation: 6,
  },
  profileAvatarText: { color: Colors.textPrimary, fontSize: FontSize.xxl, fontWeight: FontWeight.bold },
  profileInfo: { flex: 1 },
  profileName: { color: Colors.textPrimary, fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  profileTag: { color: Colors.textMuted, fontSize: FontSize.sm },
  profileEmail: { color: Colors.textMuted, fontSize: FontSize.xs, marginTop: 2 },
  discordBadge: {},

  section: { gap: Spacing.sm },
  sectionTitle: {
    color: Colors.textSecondary, fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold, letterSpacing: 1,
    textTransform: 'uppercase', paddingHorizontal: Spacing.xs,
  },
  rowsCard: { padding: 0, overflow: 'hidden' },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    minHeight: 52,
  },
  rowIcon: { width: 32, height: 32, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, color: Colors.textPrimary, fontSize: FontSize.md },
  rowValue: { color: Colors.textMuted, fontSize: FontSize.sm, marginRight: 4 },
  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: Spacing.md },

  cmdSection: {},
  cmdCategoryLabel: { color: Colors.textMuted, fontSize: FontSize.xs, fontWeight: FontWeight.semibold, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: Spacing.sm },
  cmdList: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  cmdChip: {
    backgroundColor: Colors.bgGlassStrong,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.sm, paddingHorizontal: Spacing.sm, paddingVertical: 5,
  },
  cmdText: { color: Colors.primaryLight, fontSize: FontSize.xs, fontWeight: FontWeight.medium },
  prefixChip: { borderColor: 'rgba(251,140,0,0.4)', backgroundColor: 'rgba(251,140,0,0.1)' },
  prefixText: { color: Colors.warning },

  logoutBtn: { marginTop: Spacing.sm },
  footer: {
    color: Colors.textMuted, fontSize: FontSize.xs,
    textAlign: 'center', lineHeight: 20,
    marginTop: Spacing.sm,
  },
});
