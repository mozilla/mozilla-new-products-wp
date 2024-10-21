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
      slab: ['Mozilla Semi Slab', ...theme.fontFamily.serif],
      'slab-condensed': ['Mozilla Semi Slab Condensed', ...theme.fontFamily.serif],
      'slab-extended': ['Mozilla Semi Slab Extended', ...theme.fontFamily.serif],
    },

    fontWeight: {
      extralight: 200,
      light: 300,
      normal: 400,
      semibold: 600,
      bold: 700,
    },

    extend: {
      aria: {
        current: 'current="page"',
      },

      animation: {
        marquee: 'marquee var(--marquee-time) linear infinite',
      },

      aspectRatio: {
        logo: '446/119',
      },

      fontSize: {
        // 32px (@640px) -> 56px (@1536px)
        '4xl': 'clamp(2rem, 2.7vw + 0.9rem, 3.5rem)',
        // 36px (@640px) -> 72px (@1536px)
        '6xl': 'clamp(2.25rem, 4vw + 0.6rem, 4.5rem)',
        // 64px (@640px) -> 100px (@1536px)
        '8xl': 'clamp(4rem, 6vw + 1.25rem, 6.25rem);',
      },

      gap: {
        grid: '2.777777777vw',
      },

      lineHeight: {
        tighter: '1.05',
      },

      spacing: {
        'wp-admin-bar': 'var(--wp-admin--admin-bar--height, 0px)',
        // https://fluid-typography.netlify.app/
        site: 'clamp(1rem, 2vw + 0.25rem, 1.5rem)',
        'grid-gap': '2.777777777vw',
        'grid-parent': 'var(--grid-parent, 0px)',
        'grid-child': 'var(--grid-child, 0px)',
      },

      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(calc(-1 * var(--marquee-width)))' },
        },
      },
    },
  },
  plugins: [],
};
