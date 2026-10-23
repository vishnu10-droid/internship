/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#142D4E",
        teal: "#16B8A6",
        mint: "#E8F8F4",
        background: "#F6F8FC",
        white: "#FFFFFF",
        "main-text": "#172B4D",
        muted: "#718096",
        warning: "#F4B740",
        alert: "#F06B6B",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}