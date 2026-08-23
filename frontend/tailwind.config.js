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
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0284c7', // Enterprise Sky Blue
          600: '#0369a1',
          700: '#075985',
          800: '#0c4a6e',
          900: '#0c3a56',
        },
        accent: {
          blue: '#0284c7',
          cyan: '#38bdf8',
          electric: '#00d2ff',
          indigo: '#3b82f6',
          purple: '#8b5cf6',
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
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        cinzel: ['Outfit', 'sans-serif'],
        tech: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'emerald-glow': '0 0 35px rgba(5, 150, 105, 0.4)',
        'gold-glow': '0 0 20px rgba(245, 158, 11, 0.3)',
        'sky-glow': '0 0 30px rgba(14, 165, 233, 0.35)',
        'indigo-glow': '0 0 40px rgba(59, 130, 246, 0.5)',
      },
    },
  },
  plugins: [],
}
