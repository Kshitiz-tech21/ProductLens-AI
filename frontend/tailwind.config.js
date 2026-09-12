/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#b3d8ff',
          300: '#7cb5ff',
          400: '#3b9eff',
          500: '#007fff',
          600: '#006acc',
          700: '#0059b3',
          800: '#004a99',
          900: '#003b7d',
        },
      },
    },
  },
  plugins: [],
}
