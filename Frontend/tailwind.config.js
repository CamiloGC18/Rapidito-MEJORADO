/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // Silicon Valley Luxury - SF Pro / Inter
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Inter', 'system-ui', 'sans-serif'],
        display: ['SF Pro Display', 'Inter', '-apple-system', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        // ===== SILICON VALLEY LUXURY - iOS SYSTEM COLORS =====
        
        // Light Mode Background System
        ios: {
          bg: '#F2F2F7',           // iOS System Gray 6 (Main background)
          surface: '#FFFFFF',      // Elevated surface
          elevated: '#FFFFFF',     // Cards, panels
          grouped: '#F2F2F7',      // Grouped content background
        },
        
        // Dark Mode Background System
        'ios-dark': {
          bg: '#000000',           // Pure black (OLED)
          surface: '#1C1C1E',      // Elevated surface
          elevated: '#2C2C2E',     // Cards, panels
          grouped: '#000000',      // Grouped content background
        },
        
        // Text Colors (Light Mode)
        text: {
          primary: '#000000',      // Primary text
          secondary: '#8E8E93',    // Secondary/muted text (iOS Gray)
          tertiary: '#C7C7CC',     // Tertiary text
          inverted: '#FFFFFF',     // Text on dark surfaces
        },
        
        // Text Colors (Dark Mode)
        'text-dark': {
          primary: '#FFFFFF',
          secondary: '#8E8E93',
          tertiary: '#48484A',
          inverted: '#000000',
        },
        
        // Accent Colors (iOS System)
        accent: {
          blue: '#007AFF',         // Primary interactive
          green: '#34C759',        // Success
          orange: '#FF9500',       // Warning
          red: '#FF3B30',          // Error/Destructive
          purple: '#AF52DE',       // Premium
          teal: '#5AC8FA',         // Info
        },
        
        // Brutalist Minimalist - Pure B&W
        brutalist: {
          black: '#000000',
          white: '#FFFFFF',
          gray: '#8E8E93',
        },
        
        // Glass Effects
        glass: {
          light: 'rgba(255, 255, 255, 0.80)',
          dark: 'rgba(0, 0, 0, 0.80)',
          border: 'rgba(255, 255, 255, 0.20)',
          'border-dark': 'rgba(255, 255, 255, 0.10)',
        },
        
        // Legacy compatibility
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        
        // iOS Color Shortcuts (for easy class usage)
        'ios-blue': '#007AFF',
        'ios-green': '#34C759',
        'ios-orange': '#FF9500',
        'ios-red': '#FF3B30',
        'ios-purple': '#AF52DE',
        'ios-teal': '#5AC8FA',
        'ios-gray': '#8E8E93',
        'ios-gray-dark': '#48484A',
      },
      
      // ===== SILICON VALLEY SHADOWS =====
      boxShadow: {
        // Floating Island Shadows (Multi-layer)
        'island': '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
        'island-dark': '0 8px 32px rgba(0, 0, 0, 0.40), 0 2px 8px rgba(0, 0, 0, 0.20)',
        'island-xl': '0 16px 48px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.06)',
        'island-xl-dark': '0 16px 48px rgba(0, 0, 0, 0.50), 0 4px 16px rgba(0, 0, 0, 0.25)',
        
        // Glass shadows
        'glass': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.40)',
        'glass-xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        
        // Premium glow
        'glow-blue': '0 0 20px rgba(0, 122, 255, 0.30)',
        'glow-green': '0 0 20px rgba(52, 199, 89, 0.30)',
        
        // Legacy
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      },
      
      // ===== ISLAND ARCHITECTURE - Border Radius =====
      borderRadius: {
        // Brutalist Minimalist System
        'island': '24px',          // Panels, cards
        'island-lg': '32px',       // Large floating islands
        'island-xl': '40px',       // Hero sections
        'button': '9999px',        // Buttons (full rounded)
        'input': '9999px',         // Inputs (full rounded)
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      // ===== SPRING PHYSICS ANIMATIONS =====
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'spring-heavy': 'cubic-bezier(0.22, 1.0, 0.36, 1)',
        'decelerate': 'cubic-bezier(0, 0, 0.2, 1)',
        'accelerate': 'cubic-bezier(0.4, 0, 1, 1)',
        'ios': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
        '450': '450ms',
      },
      
      animation: {
        // Core animations
        'fade-in': 'fadeIn 0.4s cubic-bezier(0, 0, 0.2, 1)',
        'slide-up': 'slideUp 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'scale-in': 'scaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'press': 'press 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        
        // Silicon Valley Luxury - Island Animations
        'island-enter': 'islandEnter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'island-exit': 'islandExit 0.3s cubic-bezier(0.4, 0, 1, 1)',
        'float-up': 'floatUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer': 'shimmer 2s linear infinite',
        
        // Swiss Minimalist Animations
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-left': 'slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'card-reveal': 'cardReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        press: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        
        // Silicon Valley Luxury Keyframes
        islandEnter: {
          '0%': { opacity: '0', transform: 'translateY(40px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        islandExit: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(20px) scale(0.98)' },
        },
        floatUp: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        
        // Swiss Keyframes
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-60px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        cardReveal: {
          '0%': { opacity: '0', transform: 'translateY(100px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      // ===== TYPOGRAPHY SCALE =====
      fontSize: {
        // Brutalist Typography - Huge bold headings
        'display': ['48px', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.02em' }],
        'display-sm': ['36px', { lineHeight: '1.15', fontWeight: '700', letterSpacing: '-0.02em' }],
        'heading': ['32px', { lineHeight: '1.2', fontWeight: '600', letterSpacing: '-0.01em' }],
        'heading-sm': ['24px', { lineHeight: '1.25', fontWeight: '600' }],
        'title': ['20px', { lineHeight: '1.3', fontWeight: '600' }],
        'body': ['17px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['15px', { lineHeight: '1.5', fontWeight: '400' }],
        // Tiny uppercase tracked labels
        'label': ['11px', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '0.06em' }],
        'label-xs': ['10px', { lineHeight: '1.2', fontWeight: '600', letterSpacing: '0.08em' }],
      },
      
      minHeight: {
        'touch': '44px',
        'button': '48px',
        'screen-dvh': '100dvh',
      },
      height: {
        'screen-dvh': '100dvh',
      },
      maxHeight: {
        'screen-dvh': '100dvh',
      },
      maxWidth: {
        'screen': '100vw',
      },
      
      // ===== Z-INDEX LAYER SYSTEM =====
      // Map (z-0) → Overlays (z-10) → Panels (z-20) → Modals (z-30) → Toasts (z-50)
      zIndex: {
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        '100': '100',
        '200': '200',
        '300': '300',
        '400': '400',
        '500': '500',
      },
      
      // ===== ISLAND ARCHITECTURE SPACING =====
      // Never touch screen edges: mx-4, mx-6, mb-6
      spacing: {
        'island': '16px',       // mx-4
        'island-lg': '24px',    // mx-6
        'island-bottom': '24px', // mb-6
        '18': '4.5rem',
        '22': '5.5rem',
      },
      
      // Safe area spacing
      padding: {
        'safe': 'env(safe-area-inset-bottom, 0px)',
        'safe-top': 'env(safe-area-inset-top, 0px)',
        'safe-bottom': 'env(safe-area-inset-bottom, 0px)',
        'safe-left': 'env(safe-area-inset-left, 0px)',
        'safe-right': 'env(safe-area-inset-right, 0px)',
      },
      margin: {
        'safe': 'env(safe-area-inset-bottom, 0px)',
        'safe-top': 'env(safe-area-inset-top, 0px)',
        'safe-bottom': 'env(safe-area-inset-bottom, 0px)',
        'safe-left': 'env(safe-area-inset-left, 0px)',
        'safe-right': 'env(safe-area-inset-right, 0px)',
      },
      
      // ===== BACKDROP BLUR =====
      backdropBlur: {
        'xs': '2px',
        'glass': '20px',
        'glass-heavy': '40px',
      },
    },
  },
  plugins: [],
  // Safelist critical utility classes to prevent purging
  safelist: [
    'overflow-x-hidden',
    'overflow-y-auto',
    'w-full',
    'h-full',
    'min-h-screen',
    'max-w-full',
    
    // ===== SILICON VALLEY LUXURY CLASSES =====
    // Island Architecture
    'mx-4',
    'mx-6',
    'mb-6',
    'rounded-island',
    'rounded-island-lg',
    'rounded-full',
    'rounded-3xl',
    
    // Glassmorphism
    'glass-panel',
    'glass-panel-dark',
    'glass-panel-intense',
    'glass-luxury',
    'island-panel',
    'backdrop-blur-xl',
    'bg-white/80',
    'bg-black/80',
    'border-white/20',
    'border-white/10',
    
    // Shadows
    'shadow-island',
    'shadow-island-xl',
    'shadow-glass',
    'shadow-2xl',
    
    // Typography
    'text-display',
    'text-heading',
    'text-label',
    'uppercase',
    'tracking-wider',
    
    // Spring physics
    'ease-spring',
    'ease-premium',
    'ease-ios',
    'duration-300',
    'duration-350',
    'duration-400',
    
    // Animations
    'animate-island-enter',
    'animate-float-up',
    'animate-shimmer',
    
    // Legacy compatibility
    'glass-panel-intense',
    'text-gradient-emerald',
    'text-gradient-green',
    'text-gradient-dark',
    
    // Safe area utilities
    'pt-safe',
    'pb-safe',
    'pl-safe',
    'pr-safe',
    'mt-safe',
    'mb-safe',
    'ml-safe',
    'mr-safe',
    'inset-safe',
    
    // Utility classes
    'shadow-float',
    'shadow-glow-emerald',
    'transition-spring',
    'transition-smooth',
    'touch-target',
    'no-select',
    'gpu-accelerated',
  ],
};

