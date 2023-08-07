/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark": '#202225',
        "light": "#C1C7E0"
      }
    },
  },
  plugins: [],
}

