/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF773D',
        black: '#1b1b1b',
        white: '#fff',
      },
      fontFamily: {
        primary: ['Cabinet-Grotesk', 'sans-serif'],
        secondary: ['clash-display', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
