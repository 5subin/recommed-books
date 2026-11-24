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
          50: '#fbf8f5',
          100: '#f5eee6',
          200: '#e9dac9',
          300: '#d7be9f',
          400: '#c59d72',
          500: '#b08151',
          600: '#946642',
          700: '#764d36',
          800: '#624031',
          900: '#53372c',
        }
      },
      fontFamily: {
        serif: ['"Noto Serif KR"', 'serif'],
        sans: ['"Pretendard"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
