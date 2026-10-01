import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, Pressable, ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useBot } from '@/hooks/useBot';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';

export default function LoginScreen() {
  const { isLoggedIn, isAuthLoading, login, loginMode } = useBot();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (isLoggedIn && !isAuthLoading) {
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, isAuthLoading]);

  return (
    <View style={styles.container}>
      {/* Background */}
      <Image
        source={require('@/assets/images/onboarding-bg.png')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={200}
      />
      <LinearGradient
        colors={['rgba(10,10,10,0.3)', 'rgba(10,10,10,0.85)', '#0a0a0a']}
        style={StyleSheet.absoluteFill}
      />

      {/* Top Glow */}
      <View style={styles.topGlow} />

      <View style={[styles.content, {
        paddingBottom: insets.bottom + Spacing.xl,
        paddingTop: insets.top + Spacing.xl,
      }]}>
        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoWrap}>
            <Image
              source={require('@/assets/images/denzzmusic-logo.png')}
              style={styles.logo}
              contentFit="contain"
              transition={300}
            />
          </View>
          <Text style={styles.appName}>DENZZMUSIC</Text>
          <Text style={styles.tagline}>Discord Music Bot 24/7</Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          {[
            { icon: 'music-note', text: 'High quality music playback' },
            { icon: 'all-inclusive', text: '24/7 voice connection mode' },
            { icon: 'queue-music', text: 'Smart queue management' },
            { icon: 'dashboard', text: 'Real-time dashboard control' },
          ].map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <MaterialIcons name={f.icon as any} size={18} color={Colors.primaryLight} />
              </View>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <View style={styles.ctaSection}>
          <Pressable
            onPress={login}
            disabled={isAuthLoading}
            style={({ pressed }) => [
              styles.loginBtn,
              (pressed || isAuthLoading) && { opacity: 0.8, transform: [{ scale: 0.98 }] },
            ]}
          >
            <LinearGradient
              colors={[Colors.primaryLight, Colors.primary, Colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.loginGradient}
            >
              {isAuthLoading ? (
                <ActivityIndicator color={Colors.textPrimary} size="small" />
              ) : (
                <MaterialIcons name="discord" size={22} color={Colors.textPrimary} />
              )}
              <Text style={styles.loginText}>
                {isAuthLoading ? 'Connecting...' : 'Login with Discord'}
              </Text>
            </LinearGradient>
          </Pressable>

          {/* Mode indicator */}
          {loginMode === 'mock' ? (
            <View style={styles.modeBanner}>
              <MaterialIcons name="info-outline" size={14} color={Colors.warning} />
              <Text style={styles.mockNotice}>
                DEMO MODE — Set EXPO_PUBLIC_DISCORD_CLIENT_ID to enable real OAuth
              </Text>
            </View>
          ) : (
            <View style={styles.modeBanner}>
              <MaterialIcons name="lock" size={14} color={Colors.success} />
              <Text style={styles.realNotice}>
                Discord OAuth2 · Secure login via Discord
              </Text>
            </View>
          )}
        </View>

        {/* OAuth info */}
        {loginMode === 'real' ? (
          <View style={styles.oauthInfo}>
            <Text style={styles.oauthInfoText}>
              You will be redirected to Discord to authorize DENZZMUSIC.{'\n'}
              Only servers where you have <Text style={{ color: Colors.primaryLight }}>Manage Server</Text> permission are shown.
            </Text>
          </View>
        ) : null}

        {/* Footer */}
        <Text style={styles.footer}>DENZZMUSIC — Discord Music Bot 24/7</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  topGlow: {
    position: 'absolute', top: -80, left: '10%', right: '10%',
    height: 200, borderRadius: 100,
    backgroundColor: Colors.primary,
    opacity: 0.15,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1, shadowRadius: 80,
  },
  content: {
    flex: 1, paddingHorizontal: Spacing.xl,
    justifyContent: 'space-between',
  },
  logoSection: { alignItems: 'center', marginTop: Spacing.xl },
  logoWrap: {
    width: 100, height: 100, borderRadius: 28,
    backgroundColor: Colors.bgGlassStrong,
    borderWidth: 1, borderColor: Colors.borderStrong,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 30,
    elevation: 10, marginBottom: Spacing.md,
  },
  logo: { width: 72, height: 72 },
  appName: {
    color: Colors.textPrimary, fontSize: FontSize.display,
    fontWeight: FontWeight.extrabold, letterSpacing: 3,
  },
  tagline: {
    color: Colors.textSecondary, fontSize: FontSize.md,
    marginTop: Spacing.xs, letterSpacing: 1,
  },

  features: {
    backgroundColor: Colors.bgGlass,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.xl,
    padding: Spacing.lg, gap: Spacing.md,
  },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  featureIcon: {
    width: 36, height: 36, borderRadius: Radius.sm,
    backgroundColor: Colors.primaryGlow,
    alignItems: 'center', justifyContent: 'center',
  },
  featureText: { color: Colors.textSecondary, fontSize: FontSize.md },

  ctaSection: { gap: Spacing.sm },
  loginBtn: {
    borderRadius: Radius.lg, overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5, shadowRadius: 20, elevation: 8,
  },
  loginGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: Spacing.md + 2, gap: Spacing.sm, minHeight: 56,
  },
  loginText: {
    color: Colors.textPrimary, fontSize: FontSize.lg,
    fontWeight: FontWeight.bold, letterSpacing: 0.5,
  },

  modeBanner: {
    flexDirection: 'row', alignItems: 'flex-start',
    gap: 6, paddingHorizontal: Spacing.xs,
  },
  mockNotice: {
    flex: 1, color: Colors.warning, fontSize: FontSize.xs,
    letterSpacing: 0.5, lineHeight: 18,
  },
  realNotice: {
    flex: 1, color: Colors.success, fontSize: FontSize.xs,
    letterSpacing: 0.5,
  },

  oauthInfo: {
    backgroundColor: 'rgba(229,57,53,0.08)',
    borderWidth: 1, borderColor: 'rgba(229,57,53,0.2)',
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  oauthInfoText: {
    color: Colors.textMuted, fontSize: FontSize.xs,
    lineHeight: 18, textAlign: 'center',
  },

  footer: {
    color: Colors.textMuted, fontSize: FontSize.xs,
    textAlign: 'center', letterSpacing: 0.5,
  },
});
