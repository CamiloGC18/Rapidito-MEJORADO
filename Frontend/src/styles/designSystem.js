/**
 * 🏝️ SILICON VALLEY LUXURY DESIGN SYSTEM
 * Ultra-Premium, Brutalist Minimalist, Liquid Glass Aesthetic
 * iOS Native Experience - Floating Island Architecture
 */

// ===== COLOR PALETTE - iOS SYSTEM COLORS =====
export const colors = {
  // Light Mode
  light: {
    bg: '#F2F2F7',              // iOS System Gray 6 (Main background)
    surface: '#FFFFFF',          // Elevated surface
    elevated: '#FFFFFF',         // Cards, panels
    textPrimary: '#000000',      // Primary text
    textSecondary: '#8E8E93',    // iOS Gray
    textTertiary: '#C7C7CC',     // Tertiary
  },
  
  // Dark Mode
  dark: {
    bg: '#000000',              // Pure black (OLED)
    surface: '#1C1C1E',          // Elevated surface
    elevated: '#2C2C2E',         // Cards, panels
    textPrimary: '#FFFFFF',      // Primary text
    textSecondary: '#8E8E93',    // iOS Gray
    textTertiary: '#48484A',     // Tertiary
  },
  
  // Accent Colors (iOS System)
  accent: {
    blue: '#007AFF',             // Primary interactive
    green: '#34C759',            // Success
    orange: '#FF9500',           // Warning
    red: '#FF3B30',              // Error/Destructive
    purple: '#AF52DE',           // Premium
    teal: '#5AC8FA',             // Info
  },
  
  // Glass Effects
  glass: {
    light: 'rgba(255, 255, 255, 0.80)',
    lightIntense: 'rgba(255, 255, 255, 0.90)',
    dark: 'rgba(0, 0, 0, 0.80)',
    darkIntense: 'rgba(0, 0, 0, 0.90)',
    border: 'rgba(255, 255, 255, 0.20)',
    borderDark: 'rgba(255, 255, 255, 0.10)',
  },
  
  // Brutalist Pure B&W
  brutalist: {
    black: '#000000',
    white: '#FFFFFF',
    gray: '#8E8E93',
  },
  
  // Legacy compatibility
  primary: '#000000',
  surface: '#0A0A0A',
  card: '#141414',
  border: 'rgba(255,255,255,0.08)',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.65)',
  accent: '#007AFF',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  overlay: 'rgba(0,0,0,0.4)',
  glassBg: 'rgba(20, 20, 20, 0.85)',
  glassGlow: 'rgba(0, 122, 255, 0.2)',
}

// ===== TYPOGRAPHY SYSTEM - BRUTALIST MINIMALIST =====
export const typography = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Inter', system-ui, sans-serif",
  
  // Huge bold headings (32px+)
  display: {
    fontSize: '48px',
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  displaySm: {
    fontSize: '36px',
    fontWeight: 700,
    lineHeight: 1.15,
    letterSpacing: '-0.02em',
  },
  heading: {
    fontSize: '32px',
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
  },
  headingSm: {
    fontSize: '24px',
    fontWeight: 600,
    lineHeight: 1.25,
  },
  title: {
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  body: {
    fontSize: '17px',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  bodySm: {
    fontSize: '15px',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  
  // Tiny uppercase tracked labels (11px)
  label: {
    fontSize: '11px',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  labelXs: {
    fontSize: '10px',
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  
  // Mobile variants
  mobile: {
    display: { fontSize: '36px', fontWeight: 700, lineHeight: 1.15 },
    heading: { fontSize: '28px', fontWeight: 600, lineHeight: 1.2 },
    headingSm: { fontSize: '22px', fontWeight: 600, lineHeight: 1.25 },
    title: { fontSize: '18px', fontWeight: 600, lineHeight: 1.3 },
    body: { fontSize: '15px', fontWeight: 400, lineHeight: 1.5 },
  }
}

// ===== SPACING SCALE - ISLAND ARCHITECTURE =====
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px', 
  base: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  
  // Island Architecture - Never touch screen edges
  island: '16px',        // mx-4
  islandLg: '24px',      // mx-6
  islandBottom: '24px',  // mb-6
  
  // Component padding
  cardPadding: '20px',
  panelPadding: '24px',
}

// ===== BORDER RADIUS - BRUTALIST MINIMALIST =====
export const borderRadius = {
  // Panels & Cards
  island: '24px',        // rounded-3xl
  islandLg: '32px',      // Large floating islands
  islandXl: '40px',      // Hero sections
  
  // Buttons & Inputs (full rounded)
  button: '9999px',      // rounded-full
  input: '9999px',       // rounded-full
  
  // Legacy
  small: '8px',
  medium: '16px',
  large: '24px',
  xlarge: '32px',
  full: '9999px',
}

// ===== SHADOW SYSTEM - FLOATING LAYERS =====
export const shadows = {
  // Island Shadows (Multi-layer for depth)
  island: '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
  islandDark: '0 8px 32px rgba(0, 0, 0, 0.40), 0 2px 8px rgba(0, 0, 0, 0.20)',
  islandXl: '0 16px 48px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.06)',
  islandXlDark: '0 16px 48px rgba(0, 0, 0, 0.50), 0 4px 16px rgba(0, 0, 0, 0.25)',
  
  // Glass shadows
  glass: '0 8px 32px rgba(0, 0, 0, 0.08)',
  glassDark: '0 8px 32px rgba(0, 0, 0, 0.40)',
  
  // Legacy
  level1: '0 2px 8px rgba(0,0,0,0.12)',
  level2: '0 4px 16px rgba(0,0,0,0.16)',
  level3: '0 8px 24px rgba(0,0,0,0.20)',
  level4: '0 16px 48px rgba(0,0,0,0.28)',
}

// ===== GLASSMORPHISM - LIQUID GLASS EFFECT =====
export const glassEffect = {
  // Light Mode
  light: {
    background: 'rgba(255, 255, 255, 0.80)',
    backdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.20)',
    boxShadow: shadows.island,
  },
  lightIntense: {
    background: 'rgba(255, 255, 255, 0.90)',
    backdropFilter: 'blur(40px) saturate(200%)',
    border: '1px solid rgba(255, 255, 255, 0.30)',
    boxShadow: shadows.islandXl,
  },
  
  // Dark Mode
  dark: {
    background: 'rgba(0, 0, 0, 0.80)',
    backdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.10)',
    boxShadow: shadows.islandDark,
  },
  darkIntense: {
    background: 'rgba(0, 0, 0, 0.90)',
    backdropFilter: 'blur(40px) saturate(200%)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: shadows.islandXlDark,
  },
  
  // Legacy
  background: 'rgba(20, 20, 20, 0.85)',
  backdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.08)',
}

// ===== SPRING PHYSICS - FRAMER MOTION =====
export const springConfig = {
  // Standard spring for panels sliding up
  panel: {
    type: 'spring',
    damping: 25,
    stiffness: 300,
  },
  // Snappy spring for button taps
  button: {
    type: 'spring',
    damping: 20,
    stiffness: 400,
  },
  // Gentle spring for large elements
  gentle: {
    type: 'spring',
    damping: 30,
    stiffness: 200,
  },
  // Quick spring for micro-interactions
  quick: {
    type: 'spring',
    damping: 15,
    stiffness: 500,
  },
}

// ===== ANIMATION CONSTANTS =====
export const animation = {
  // Spring configurations
  spring: springConfig,
  
  // Timing functions
  easing: {
    premium: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    ios: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
  },
  
  // Durations
  duration: {
    instant: '100ms',
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    panel: '450ms',
  },
  
  // Button scale on tap
  tapScale: 0.95,
}

// Breakpoints
export const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
}

// ===== Z-INDEX LAYER SYSTEM =====
// Map (z-0) → Overlays (z-10) → Panels (z-20) → Modals (z-30) → Toasts (z-50)
export const zIndex = {
  map: 0,
  overlay: 10,
  panel: 20,
  modal: 30,
  dropdown: 40,
  toast: 50,
  highest: 100,
}

// Responsive mixins
export const responsive = {
  mobile: `@media (max-width: ${breakpoints.tablet})`,
  tablet: `@media (min-width: ${breakpoints.tablet}) and (max-width: ${breakpoints.desktop})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
}

// ===== PRESET STYLES =====
export const presets = {
  // Glass Island Panel (Light Mode)
  glassIsland: {
    ...glassEffect.light,
    borderRadius: borderRadius.island,
  },
  
  // Glass Island Panel (Dark Mode)
  glassIslandDark: {
    ...glassEffect.dark,
    borderRadius: borderRadius.island,
  },
  
  // Floating Island preset
  floatingIsland: {
    ...glassEffect.light,
    borderRadius: borderRadius.islandLg,
    padding: spacing.panelPadding,
  },
  
  // Button preset
  buttonPrimary: {
    background: colors.brutalist.black,
    color: colors.brutalist.white,
    borderRadius: borderRadius.button,
    padding: `${spacing.md} ${spacing.lg}`,
    fontWeight: 600,
    fontSize: typography.body.fontSize,
  },
  
  // Input preset
  inputGlass: {
    ...glassEffect.light,
    borderRadius: borderRadius.input,
    padding: `${spacing.md} ${spacing.lg}`,
    fontSize: typography.body.fontSize,
  },
  
  // Label preset (tiny, uppercase, tracked)
  label: {
    ...typography.label,
    color: colors.light.textSecondary,
  },
}
