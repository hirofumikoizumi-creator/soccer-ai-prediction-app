/**
 * SAMURAI BLUE Premium Theme
 * Inspired by Japanese national team with modern premium aesthetics
 */

export const Colors = {
  // Primary colors - SAMURAI BLUE (Premium)
  primary: '#003DA5', // Deep Navy Blue
  primaryLight: '#0052CC', // Brighter blue
  primaryDark: '#001F5C', // Darker blue

  // Accent colors - Japan Red
  accent: '#E60012', // Vibrant Red
  accentLight: '#FF4444', // Lighter red
  accentDark: '#B30000', // Darker red

  // Neutral colors - Premium grayscale
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Semantic colors
  background: '#FFFFFF',
  surface: '#F8F9FA',
  surfaceVariant: '#F0F2F5',
  border: '#E5E7EB',
  divider: '#D1D5DB',

  // Text colors
  textPrimary: '#1A1A1A',
  textSecondary: '#555555',
  textTertiary: '#888888',
  textInverse: '#FFFFFF',

  // Gradient colors
  gradientStart: '#003DA5',
  gradientEnd: '#0052CC',
  gradientAccent: '#E60012',

  // Transparency
  transparent: 'transparent',
  blackTransparent5: 'rgba(0, 0, 0, 0.05)',
  blackTransparent10: 'rgba(0, 0, 0, 0.1)',
  blackTransparent20: 'rgba(0, 0, 0, 0.2)',
  whiteTransparent10: 'rgba(255, 255, 255, 0.1)',
  whiteTransparent20: 'rgba(255, 255, 255, 0.2)',

  // Premium colors
  primaryLight2: '#E3F2FD',
  accentLight2: '#FFEBEE',
};

export type ColorKey = keyof typeof Colors;
