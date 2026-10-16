/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Figtree', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'Figtree', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f1f0ff',
          100: '#e6e4ff',
          200: '#cfccff',
          300: '#aaa4ff',
          400: '#7f76ff',
          500: '#5b50f7',
          600: '#4338f0',
          700: '#3629d6',
          800: '#2d24ac',
          900: '#271f85',
        },
        ink: {
          DEFAULT: '#14122b',
          soft: '#4a4866',
          mute: '#807e9a',
        },
        paper: '#f6f6fb',
        marigold: {
          DEFAULT: '#ffc233',
          deep: '#e8a400',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(20,18,43,.04), 0 8px 24px -12px rgba(20,18,43,.12)',
        lift: '0 2px 4px rgba(20,18,43,.05), 0 24px 40px -20px rgba(67,56,240,.35)',
        pop: '0 12px 40px -8px rgba(20,18,43,.28)',
      },
      keyframes: {
        rise: {
          '0%': { opacity: 0, transform: 'translateY(14px)' },
          '100%': { opacity: 1, transform: 'none' },
        },
        pop: {
          '0%': { opacity: 0, transform: 'translateY(-6px) scale(.97)' },
          '100%': { opacity: 1, transform: 'none' },
        },
        fade: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
      },
      animation: {
        rise: 'rise .6s cubic-bezier(.2,.7,.2,1) both',
        pop: 'pop .16s ease-out both',
        fade: 'fade .18s ease-out both',
      },
    },
  },
  plugins: [],
};
