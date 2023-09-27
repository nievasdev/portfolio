import {nextui} from '@nextui-org/react'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors : {
        spacial:{
            1: '#222831',
            2: '#1D1D1F',
            3: '#00ADB5',
            4: '#EEEEEE'
        }
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}
