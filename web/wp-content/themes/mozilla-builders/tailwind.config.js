import theme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.twig'],
  theme: {
    colors: {
      current: 'currentColor',
      transparent: 'transparent',
      black: '#000000',
      white: '#ffffff',
      gray: '#F0F0F0',
      green: {
        DEFAULT: '#00D230',
        dark: '#005E2A',
      },
      orange: '#FF9900',
      yellow: '#FFDD63',
      purple: '#7F00CA',
      pink: '#FF008A',
    },

    fontFamily: {
      sans: ['Mozilla Sans', ...theme.fontFamily.sans],
    },

    fontWeight: {
      extralight: 200,
      light: 300,
      normal: 400,
      semibold: 600,
      bold: 700,
    },

    extend: {
      aspectRatio: {
        logo: '446/119',
      },

      spacing: {
        'wp-admin-bar': 'var(--wp-admin--admin-bar--height, 0px)',
      },
    },
  },
  plugins: [],
};
