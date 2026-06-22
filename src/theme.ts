/**
 * Spectaculeads brand theme.
 * Colors and type scale are fixed by the brand guide — use these tokens everywhere.
 */

export const colors = {
  // Dark (brand) surfaces
  navy: '#191C3B', // app background on dark screens
  indigo: '#20234E', // surface / primary button

  // Teal accent family
  teal: '#27B7CE',
  tealLight: '#5FD3E3',
  tealDeep: '#1A8AA0',

  // Light screens
  lightBg: '#EAEDF3',
  card: '#FFFFFF',
  text: '#1A1D3A',
  muted: '#6E7388',

  // Utility
  white: '#FFFFFF',
  border: '#E2E6EF',
  borderDark: 'rgba(255,255,255,0.10)',
  cardDark: '#20234E',
  success: '#34C77B',
  warning: '#F2B544',
  danger: '#E2574C',
  overlay: 'rgba(10,12,28,0.6)',
};

export const fonts = {
  // Headings — Sora
  heading: 'Sora_700Bold',
  headingSemi: 'Sora_600SemiBold',
  headingRegular: 'Sora_400Regular',
  // Body — Figtree
  body: 'Figtree_400Regular',
  bodyMedium: 'Figtree_500Medium',
  bodySemi: 'Figtree_600SemiBold',
  bodyBold: 'Figtree_700Bold',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 26,
  pill: 999,
};

export const shadow = {
  card: {
    shadowColor: '#1A1D3A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
};
