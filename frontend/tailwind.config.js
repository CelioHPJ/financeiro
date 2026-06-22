/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc',
        card: '#ffffff',
      },
      boxShadow: {
        'premium': '0 8px 30px rgba(0,0,0,0.04)',
      }
    },
  },
  plugins: [],
}
