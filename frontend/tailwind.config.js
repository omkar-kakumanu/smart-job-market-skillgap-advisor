/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // Royal Indigo
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        accent: {
          blue: '#4f46e5',
          cyan: '#6366f1',
          electric: '#818cf8',
          indigo: '#4f46e5',
          purple: '#7c3aed',
          dark: '#0f172a',
        },
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        gold: {
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
        },
        darkbg: '#060c0a',
        darkcard: '#0d1714',
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        cinzel: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        tech: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        rubik: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'emerald-glow': '0 0 35px rgba(5, 150, 105, 0.4)',
        'gold-glow': '0 0 20px rgba(245, 158, 11, 0.3)',
        'sky-glow': '0 0 30px rgba(99, 102, 241, 0.35)',
        'indigo-glow': '0 0 40px rgba(99, 102, 241, 0.45)',
        'brand-glow': '0 0 35px rgba(99, 102, 241, 0.4)',
      },
    },
  },
  plugins: [],
}
