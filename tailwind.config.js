/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    'node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {},
    fontFamily: {
      sans: ["Poppins"],
      serif: ["Poppins"],
      mono: ["Poppins"],
      display: ["Poppins"],
      body: ["Poppins"]
    },
  },
  plugins: [
    require('flowbite')
  ],
}
