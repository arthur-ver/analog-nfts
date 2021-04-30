const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  important: 'html',
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        mono: ['IBM Plex Mono', ...defaultTheme.fontFamily.mono],
        serif: ['SuisseWorks', ...defaultTheme.fontFamily.serif],
        sans: ['SuisseIntl', ...defaultTheme.fontFamily.sans]
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#000',
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            a: {
              color: '#000',
              textDecoration: 'none',
              '&:hover': {
                color: '#000',
              },
            },
          },
        },
      }
    },
    minHeight: {
      '4' : '4rem'
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
