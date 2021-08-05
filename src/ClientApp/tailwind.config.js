/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require('tailwindcss/colors')
const forms = require('@tailwindcss/forms')
const typography = require('@tailwindcss/typography')

module.exports = {
  mode: 'jit',
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './index.html',
      './src/**/*.vue',
      './src/**/*.js',
      './src/**/*.ts'
    ],
    safelist: ['prose', 'prose-sm', 'm-auto', 'text-left']
  },
  darkMode: 'class',
  plugins: [typography, forms],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-to-b-70': 'linear-gradient(to bottom, var(--tw-gradient-stops) 70%)'
      },
      colors: {
        'blazor-blue': '#052767',
        'blazor-indigo': '#3a0647',
        'teal': colors.teal
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'inherit',
            a: {
              'color': 'inherit',
              'opacity': 0.75,
              '&:hover': {
                opacity: 1,
                color: colors.teal[600]
              }
            },
            b: { color: 'inherit' },
            strong: { color: 'inherit' },
            em: { color: 'inherit' },
            h1: { color: 'inherit' },
            h2: { color: 'inherit' },
            h3: { color: 'inherit' },
            h4: { color: 'inherit' },
            code: { color: 'inherit' }
          }
        }
      }
    }
  }
}
