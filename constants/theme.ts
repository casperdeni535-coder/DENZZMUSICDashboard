// DENZZMUSIC Design Tokens
export const Colors = {
  // Base
  bg: '#0a0a0a',
  bgCard: '#111111',
  bgGlass: 'rgba(255,255,255,0.04)',
  bgGlassStrong: 'rgba(255,255,255,0.08)',
  surface: '#161616',
  surfaceHover: '#1e1e1e',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.16)',

  // Brand
  primary: '#E53935',
  primaryLight: '#FF5252',
  primaryDark: '#B71C1C',
  primaryGlow: 'rgba(229,57,53,0.3)',
  primaryGlowStrong: 'rgba(229,57,53,0.5)',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textMuted: '#555555',
  textRed: '#FF5252',

  // Semantic
  success: '#4CAF50',
  successGlow: 'rgba(76,175,80,0.3)',
  warning: '#FF9800',
  info: '#2196F3',
  online: '#43B581',
  offline: '#747F8D',
  idle: '#FAA61A',

  // Overlays
  overlay: 'rgba(0,0,0,0.7)',
  overlayLight: 'rgba(0,0,0,0.4)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  display: 36,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};
