/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#Eef2f8',
          100: '#D4dde9',
          200: '#A9bdd6',
          300: '#7e9cc3',
          400: '#537bb0',
          500: '#3a6299',
          600: '#2e74b5',
          700: '#1f3864',
          800: '#16294a',
          900: '#0e1c33',
        },
        accent: {
          50: '#Eef7fd',
          100: '#D6ecfa',
          200: '#aed9f5',
          300: '#7ec0ee',
          400: '#4ea3e3',
          500: '#2e74b5',
          600: '#256299',
          700: '#1c4d7a',
          800: '#143a5c',
          900: '#0d2740',
        },
        success: { 50: '#e8f7ee', 100: '#c9edd6', 500: '#1f9d57', 600: '#178045', 700: '#116834' },
        warning: { 50: '#fef6e7', 100: '#fce8c2', 500: '#e0a317', 600: '#c48a10', 700: '#9c6e0c' },
        danger: { 50: '#fdeaea', 100: '#f9d0d0', 500: '#dc2d2d', 600: '#b52222', 700: '#911a1a' },
        teal: { 50: '#e6f7f8', 100: '#c0ecee', 500: '#0f9aa3', 600: '#0c7f87', 700: '#0a666c' },
        ink: { 50: '#f7f8fa', 100: '#eef0f4', 200: '#dde1e9', 300: '#c2c9d6', 400: '#9aa3b5', 500: '#6f7a91', 600: '#525c72', 700: '#3d465a', 800: '#2a3142', 900: '#1a1f2e' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(16, 25, 46, 0.06), 0 4px 12px rgba(16, 25, 46, 0.04)',
        cardHover: '0 2px 8px rgba(16, 25, 46, 0.08), 0 12px 24px rgba(16, 25, 46, 0.08)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
}
