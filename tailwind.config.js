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
        pitch: {
          bg: '#0d1117',
          surface: '#161b22',
          card: '#21262d',
          border: 'rgba(240, 246, 252, 0.1)',
          hover: '#30363d',
        },
        accent: {
          green: '#10b981',
          greenDark: '#2ea043',
          cyan: '#38bdf8',
          amber: '#f59e0b',
          red: '#ef4444',
        },
        sport: {
          text: '#f0f6fc',
          muted: '#8b949e',
          subtle: '#6e7681',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.95)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'glow-green': '0 0 20px -3px rgba(16, 185, 129, 0.25)',
        'glow-cyan': '0 0 20px -3px rgba(56, 189, 248, 0.25)',
      },
    },
  },
  plugins: [],
}
