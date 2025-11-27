import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@medusajs/ui/dist/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      // Custom screens for responsive design
      screens: {
      },

      // Typography
      fontFamily: {
      },
      fontSize: {
      },

      // Colors
      colors: {
      },

      // Spacing & Layout
      maxWidth: {
      },

      // Transitions
      transitionProperty: {
        width: 'width margin',
        height: 'height',
        bg: 'background-color',
        display: 'display opacity',
        visibility: 'visibility',
        padding: 'padding-top padding-right padding-bottom padding-left'
      },
    }
  },
  plugins: [require('tailwindcss-radix')()]
}

export default config
