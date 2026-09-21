import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    background: '#f7f8fa',
    surface: 'rgba(11, 21, 38, 0.04)',
    surfaceStrong: 'rgba(11, 21, 38, 0.08)',
    border: 'rgba(11, 21, 38, 0.12)',
    borderStrong: 'rgba(11, 21, 38, 0.24)',
    text: '#0b1526',
    textSecondary: 'rgba(11, 21, 38, 0.66)',
    textFaint: 'rgba(11, 21, 38, 0.48)',
    accent: '#b45309',
    accentText: '#b45309',
    accentContrast: '#ffffff',
    emerald: '#047857',
  },
  dark: {
    background: '#0a0e14',
    surface: 'rgba(255, 255, 255, 0.04)',
    surfaceStrong: 'rgba(255, 255, 255, 0.08)',
    border: 'rgba(255, 255, 255, 0.1)',
    borderStrong: 'rgba(255, 255, 255, 0.2)',
    text: '#e6e9ef',
    textSecondary: 'rgba(230, 233, 239, 0.62)',
    textFaint: 'rgba(230, 233, 239, 0.42)',
    accent: '#f5a623',
    accentText: '#fcd34d',
    accentContrast: '#0a0e14',
    emerald: '#34d399',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const MaxContentWidth = 720;
