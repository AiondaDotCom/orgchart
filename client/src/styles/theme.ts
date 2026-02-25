import type { CSSProperties } from 'react';

// ── Aionda Brand Colors ──────────────────────────────────────────
export const colors = {
  // Primary brand
  teal:         '#2AB5B2',
  tealDark:     '#1A8A8E',
  tealLight:    '#3DCDC9',
  tealMuted:    'rgba(42,181,178,0.15)',

  // Backgrounds
  bgPrimary:    '#0B0D17',
  bgCard:       '#151823',
  bgCardHover:  '#1A1E2E',
  bgSurface:    '#111320',
  bgModal:      '#181B28',
  bgInput:      '#1C1F30',

  // Borders
  border:       '#252836',
  borderLight:  '#2E3148',
  borderFocus:  '#2AB5B2',

  // Text
  textPrimary:  '#F0F0F5',
  textSecondary:'#9899A6',
  textMuted:    '#5D5F6E',
  textInverse:  '#0B0D17',

  // Status
  online:       '#22C55E',
  offline:      '#EF4444',
  unavailable:  '#6B7280',

  // Misc
  white:        '#FFFFFF',
  black:        '#000000',
  danger:       '#EF4444',
  warning:      '#F59E0B',
  success:      '#22C55E',

  // Avatar palette
  avatarPalette: [
    '#2AB5B2', '#6366F1', '#F59E0B', '#EF4444',
    '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
  ],
} as const;

// ── Spacing / Sizing ────────────────────────────────────────────
export const spacing = {
  xs:  '4px',
  sm:  '8px',
  md:  '12px',
  lg:  '16px',
  xl:  '24px',
  xxl: '32px',
  xxxl:'48px',
} as const;

export const radius = {
  sm:   '6px',
  md:   '10px',
  lg:   '14px',
  xl:   '20px',
  full: '9999px',
} as const;

// ── Shadows ─────────────────────────────────────────────────────
export const shadows = {
  card:     '0 2px 8px rgba(0,0,0,0.3)',
  cardHover:'0 8px 24px rgba(0,0,0,0.45)',
  modal:    '0 24px 64px rgba(0,0,0,0.6)',
  glow:     `0 0 20px rgba(42,181,178,0.25)`,
} as const;

// ── Typography ──────────────────────────────────────────────────
const fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

export const typography = {
  fontFamily,
  h1: {
    fontFamily,
    fontSize: '28px',
    fontWeight: 700,
    lineHeight: '36px',
    letterSpacing: '-0.02em',
    color: colors.textPrimary,
  } as CSSProperties,
  h2: {
    fontFamily,
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: '28px',
    letterSpacing: '-0.01em',
    color: colors.textPrimary,
  } as CSSProperties,
  h3: {
    fontFamily,
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '22px',
    color: colors.textPrimary,
  } as CSSProperties,
  body: {
    fontFamily,
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '20px',
    color: colors.textSecondary,
  } as CSSProperties,
  caption: {
    fontFamily,
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '16px',
    color: colors.textMuted,
  } as CSSProperties,
  tiny: {
    fontFamily,
    fontSize: '10px',
    fontWeight: 600,
    lineHeight: '14px',
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const,
    color: colors.textMuted,
  } as CSSProperties,
} as const;

// ── Shared Component Styles ─────────────────────────────────────

export const globalBodyStyles: CSSProperties = {
  margin: 0,
  padding: 0,
  backgroundColor: colors.bgPrimary,
  color: colors.textPrimary,
  fontFamily: typography.fontFamily,
  minHeight: '100vh',
  WebkitFontSmoothing: 'antialiased',
};

export const cardStyles: CSSProperties = {
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.border}`,
  borderRadius: radius.md,
  padding: spacing.lg,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

export const badgeStyles: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing.xs,
  padding: `2px ${spacing.sm}`,
  borderRadius: radius.full,
  fontSize: '11px',
  fontWeight: 600,
  fontFamily: typography.fontFamily,
  lineHeight: '16px',
};

export const skillBadgeStyles: CSSProperties = {
  ...badgeStyles,
  backgroundColor: 'rgba(42,181,178,0.12)',
  color: colors.teal,
  border: `1px solid rgba(42,181,178,0.2)`,
  fontSize: '10px',
  fontWeight: 500,
  padding: `2px 8px`,
};

export const typeBadgeAI: CSSProperties = {
  ...badgeStyles,
  backgroundColor: 'rgba(139,92,246,0.15)',
  color: '#A78BFA',
  border: '1px solid rgba(139,92,246,0.25)',
};

export const typeBadgeHuman: CSSProperties = {
  ...badgeStyles,
  backgroundColor: 'rgba(59,130,246,0.15)',
  color: '#60A5FA',
  border: '1px solid rgba(59,130,246,0.25)',
};

export const avatarStyles = (size: number, bgColor: string): CSSProperties => ({
  width: `${size}px`,
  height: `${size}px`,
  borderRadius: radius.full,
  backgroundColor: bgColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: colors.white,
  fontWeight: 700,
  fontSize: `${Math.round(size * 0.38)}px`,
  fontFamily: typography.fontFamily,
  flexShrink: 0,
  letterSpacing: '0.02em',
});

export const departmentContainerStyles: CSSProperties = {
  backgroundColor: colors.bgSurface,
  border: `1px solid ${colors.border}`,
  borderRadius: radius.lg,
  padding: spacing.xl,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.md,
};

export const modalOverlayStyles: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.65)',
  backdropFilter: 'blur(8px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

export const modalContentStyles: CSSProperties = {
  backgroundColor: colors.bgModal,
  border: `1px solid ${colors.border}`,
  borderRadius: radius.lg,
  padding: spacing.xxl,
  width: '100%',
  maxWidth: '520px',
  maxHeight: '85vh',
  overflowY: 'auto',
  boxShadow: shadows.modal,
};

export const inputStyles: CSSProperties = {
  width: '100%',
  padding: `${spacing.md} ${spacing.lg}`,
  backgroundColor: colors.bgInput,
  border: `1px solid ${colors.border}`,
  borderRadius: radius.sm,
  color: colors.textPrimary,
  fontSize: '14px',
  fontFamily: typography.fontFamily,
  outline: 'none',
  transition: 'border-color 0.2s ease',
  boxSizing: 'border-box',
};

export const selectStyles: CSSProperties = {
  ...inputStyles,
  appearance: 'none',
  WebkitAppearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239899A6' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  backgroundSize: '16px 16px',
  paddingRight: '36px',
};

export const labelStyles: CSSProperties = {
  display: 'block',
  marginBottom: spacing.xs,
  fontSize: '13px',
  fontWeight: 500,
  color: colors.textSecondary,
  fontFamily: typography.fontFamily,
};

export const buttonPrimaryStyles: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: spacing.sm,
  padding: `${spacing.md} ${spacing.xl}`,
  backgroundColor: colors.teal,
  color: colors.white,
  border: 'none',
  borderRadius: radius.sm,
  fontSize: '14px',
  fontWeight: 600,
  fontFamily: typography.fontFamily,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

export const buttonSecondaryStyles: CSSProperties = {
  ...buttonPrimaryStyles,
  backgroundColor: 'transparent',
  border: `1px solid ${colors.border}`,
  color: colors.textSecondary,
};

export const chatPanelStyles: CSSProperties = {
  position: 'fixed',
  top: 0,
  right: 0,
  width: '380px',
  height: '100vh',
  backgroundColor: colors.bgCard,
  borderLeft: `1px solid ${colors.border}`,
  display: 'flex',
  flexDirection: 'column',
  zIndex: 900,
  boxShadow: '-4px 0 24px rgba(0,0,0,0.4)',
};

export const connectingLineStyles: CSSProperties = {
  position: 'absolute',
  backgroundColor: colors.border,
};

// ── Floating Action Button ──────────────────────────────────────
export const fabStyles: CSSProperties = {
  position: 'fixed',
  bottom: '32px',
  right: '32px',
  width: '56px',
  height: '56px',
  borderRadius: radius.full,
  backgroundColor: colors.teal,
  color: colors.white,
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: '0 4px 16px rgba(42,181,178,0.4)',
  zIndex: 800,
  transition: 'all 0.2s ease',
};
