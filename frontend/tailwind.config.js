/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        KhmerMoul: 'Moul',
        NotoSansKhmer: 'Noto Sans Khmer',
      },
      animation: {
        'pulse-fast': 'pulse 6s infinite ease-in-out',
      },
    },
  },
  plugins: [],
}