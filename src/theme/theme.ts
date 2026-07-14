// Single source of truth for color, spacing, radius, and type — every
// screen/component should pull from here instead of hardcoding hex values.
// This is what makes the app read as one coherent product instead of a
// collection of separately-styled screens.

export const colors = {
  // Brand — one true orange. Previously #FF6200 / #FF5A00 / #FF6B00 were
  // all in use across different files; this is the single value going
  // forward.
  primary: '#FF5A00',
  primaryLight: '#FFF1E8',
  primaryDark: '#C2410C',

  // Neutrals
  ink: '#1E1E1E',        // primary text
  inkMuted: '#6B6B6B',   // secondary text
  inkSoft: '#8A7A72',    // tertiary/caption text
  border: '#EDE7E2',     // hairline borders on cards
  surface: '#FFFFFF',
  background: '#F9F8F7',

  // Status
  success: '#2E7D32',
  successBg: '#E8F5E9',
  danger: '#C0392B',
  dangerBg: '#FDECEA',
  warning: '#B45309',
  warningBg: '#FFF8E1',
  info: '#1976D2',
  infoBg: '#E3F2FD',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  pill: 999,
} as const;

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const },
  h2: { fontSize: 22, fontWeight: '700' as const },
  h3: { fontSize: 18, fontWeight: '700' as const },
  body: { fontSize: 15, fontWeight: '500' as const },
  caption: { fontSize: 13, fontWeight: '500' as const },
  label: { fontSize: 12, fontWeight: '700' as const, letterSpacing: 0.3 },
} as const;

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  nav: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
} as const;