/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './hooks/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Brand greens
        primary: {
          DEFAULT: '#1A3C34',
          50:  '#E8F0EE',
          100: '#C5D9D3',
          200: '#9FBFB6',
          300: '#6EA595',
          400: '#3D8B78',
          500: '#2D6A55',
          600: '#1A3C34',
          700: '#152E28',
          800: '#0F1F1C',
          900: '#080F0D',
        },
        // Gold accent
        gold: {
          DEFAULT: '#C9A84C',
          light:   '#E8C97B',
          dark:    '#9B7D30',
        },
        // Surfaces
        surface: {
          DEFAULT: '#FFFFFF',
          dark:    '#1E2D28',
          darker:  '#152520',
          card:    '#F7F9F7',
        },
        // Text
        text: {
          primary:   '#1A1A1A',
          secondary: '#6B7280',
          muted:     '#9CA3AF',
          inverse:   '#FFFFFF',
          arabic:    '#1A3C34',
        },
        // Semantic
        success: '#22C55E',
        warning: '#F59E0B',
        error:   '#EF4444',
      },
      fontFamily: {
        inter:          ['Inter_400Regular'],
        'inter-medium': ['Inter_500Medium'],
        'inter-semi':   ['Inter_600SemiBold'],
        'inter-bold':   ['Inter_700Bold'],
        arabic:         ['NotoNaskhArabic_400Regular'],
        'arabic-bold':  ['NotoNaskhArabic_700Bold'],
      },
      fontSize: {
        'arabic-sm': ['18px', { lineHeight: '32px' }],
        'arabic-md': ['22px', { lineHeight: '40px' }],
        'arabic-lg': ['28px', { lineHeight: '50px' }],
        'arabic-xl': ['34px', { lineHeight: '58px' }],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
    },
  },
  plugins: [],
};
