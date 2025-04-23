/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}', // If you're using the new app directory in Next.js 13
  ],
  theme: {
    extend: {
      screens: {
        '2xl-custom': '1650px',
      },
    },
  },
  plugins: [],
}
