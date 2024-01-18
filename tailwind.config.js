/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1a7dc4',
        primaryDark: '#306991',
        primaryAccent: '#89d5f5',

        secondary: '#cf6a3c',
        secondaryDark: '#a3451a',

        solidtecGray: '#585F66',

        solidtecBlack: '#252d33',
        solidtecBlackAccent: '#202224',
      },
      gridTemplateColumns: {
        main: '240px 1fr',
      },
      fontFamily: {
        serif: ['var(--font-inter)'],
      },
      screens: {
        '3xl': '1600px',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
};
