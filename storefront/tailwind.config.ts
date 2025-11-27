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
        '2xsmall': '320px',
        xsmall: '512px',
        small: '1024px',
        medium: '1280px',
        large: '1440px',
        xlarge: '1680px',
        '2xlarge': '1920px'
      },

      // Typography
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Ubuntu',
          'sans-serif'
        ]
      },
      fontSize: {
      },

      // Colors
      colors: {
      },

      // Spacing & Layout
      maxWidth: {
        '8xl': '100rem'
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
