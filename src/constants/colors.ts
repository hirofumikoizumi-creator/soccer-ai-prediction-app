/**
 * SAMURAI BLUE Theme Colors
 * Inspired by Japanese national team (SAMURAI BLUE)
 */

export const Colors = {
  // Primary colors - SAMURAI BLUE
  primary: '#003DA5', // Deep Navy Blue
  primaryLight: '#1E5BA8',
  primaryDark: '#001F5C',

  // Accent colors
  accent: '#E60012', // Red (Japanese flag inspired)
  accentLight: '#FF4444',
  accentDark: '#B30000',

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',

  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',

  // Semantic colors
  background: '#FFFFFF',
  surface: '#F5F5F5',
  surfaceVariant: '#EEEEEE',
  border: '#E0E0E0',
  divider: '#BDBDBD',

  // Text colors
  textPrimary: '#212121',
  textSecondary: '#757575',
  textTertiary: '#9E9E9E',
  textInverse: '#FFFFFF',

  // Gradient colors
  gradientStart: '#003DA5',
  gradientEnd: '#1E5BA8',

  // Transparency
  transparent: 'transparent',
  blackTransparent10: 'rgba(0, 0, 0, 0.1)',
  blackTransparent20: 'rgba(0, 0, 0, 0.2)',
  whiteTransparent10: 'rgba(255, 255, 255, 0.1)',
  whiteTransparent20: 'rgba(255, 255, 255, 0.2)',
};

export type ColorKey = keyof typeof Colors;
