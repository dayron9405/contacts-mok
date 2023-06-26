/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D64866',
        primaryHover: '#c6435f',
        secondary: '#6a2534',
        secondaryHover: '#4c1a25',
        even: '#112233',
        odd: '#556677'
      },
    },
  },
  plugins: [],
}

