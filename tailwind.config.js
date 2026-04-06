/** @type {import('tailwindcss').Config} */
export default {
  // Enable class-based dark mode so we can toggle via JS
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Brand accent – electric teal
        accent: {
          DEFAULT: '#00D4AA',
          50:  '#E6FBF7',
          100: '#B3F3E8',
          200: '#66E7D1',
          300: '#00D4AA',
          400: '#00B891',
          500: '#009B79',
        },
        // Danger / expense red
        danger: {
          DEFAULT: '#FF4D6A',
          light: '#FFE8EC',
        },
        // Income green
        success: {
          DEFAULT: '#00C48C',
          light: '#E6FAF4',
        },
        // Warning amber
        warning: {
          DEFAULT: '#FFB347',
          light: '#FFF4E0',
        },
        // Dark surfaces
        dark: {
          50:  '#F0F2F5',
          100: '#1A1D27',
          200: '#141720',
          300: '#0F1117',
          400: '#0A0C12',
          card: '#1E2130',
          border: '#2A2E3F',
          muted: '#6B7280',
        },
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.3)',
        glow: '0 0 20px rgba(0,212,170,0.15)',
        'glow-danger': '0 0 20px rgba(255,77,106,0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
