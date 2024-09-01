/** @type {import('tailwindcss').Config} */
export default {
  plugins: [
    require('flowbite/plugin')
  ],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}