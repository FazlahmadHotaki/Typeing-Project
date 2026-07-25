/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        gold: '#C9A15E',
        goldsoft: '#DDBD87',
        night: '#0A1424',
        night2: '#0D1B30',
        night3: '#11223B',
        slateink: '#8592AC',
        cloudwhite: '#EEF1F6',
        sky: '#7284A6',
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        arabic: ['Vazirmatn', 'sans-serif'],
      },
    },
  },
  plugins: [],
}