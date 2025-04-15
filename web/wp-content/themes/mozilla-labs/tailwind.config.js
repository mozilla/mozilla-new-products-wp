import theme from 'tailwindcss/defaultTheme';
import utilitiesScss from './plugins/utilities-scss';
import hocus from './plugins/hocus';
import path from 'path';

function color(name) {
  return `rgb(var(--color-${name}) / <alpha-value>)`;
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: ['./**/*.twig', './**/*.js'],
  theme: {
    colors: {
      // Base colors
      current: 'currentColor',
      transparent: 'transparent',
      black: color('black'),
      'off-black': color('off-black'),
      white: color('white'),
      'blue-green': color('blue-green'),
      gray: {
        DEFAULT: color('gray'),
        dark: color('gray-dark'),
      },
      green: {
        light: color('green-light'),
        DEFAULT: color('green'),
        dark: color('green-dark'),
        darker: color('green-darker'),
      },
      olive: {
        DEFAULT: color('olive'),
        dark: color('olive-dark'),
      },
      orange: {
        light: color('orange-light'),
        DEFAULT: color('orange'),
        dark: color('orange-dark'),
        darker: color('orange-darker'),
      },
      pink: {
        light: color('pink-light'),
        DEFAULT: color('pink'),
        dark: color('pink-dark'),
        darker: color('pink-darker'),
      },
      stone: color('stone'),
      yellow: color('yellow'),
      // Applied colors
      main: color('main'),
      content: {
        DEFAULT: color('content'),
        reverse: color('content-reverse'),
      },
      secondary: color('secondary'),
      code: color('code'),
      spot: color('spot'),
      action: {
        DEFAULT: color('action'),
        reverse: color('action-reverse'),
        focus: color('action-focus'),
        'focus-reverse': color('action-focus-reverse'),
      },
      'action-secondary': {
        DEFAULT: color('action-secondary'),
        reverse: color('action-secondary-reverse'),
        focus: color('action-secondary-focus'),
        'focus-reverse': color('action-secondary-focus-reverse'),
      },
      cta: {
        DEFAULT: color('cta-main'),
        text: color('cta-main-text'),
        secondary: color('cta-secondary'),
        'secondary-text': color('cta-secondary-text'),
      },
    },

    fontFamily: {
      sans: ['Mozilla Text', ...theme.fontFamily.sans],
      headline: ['Mozilla NewHeadline', ...theme.fontFamily.serif],
      monospace: ['Source Code Pro', ...theme.fontFamily.serif],
    },

    fontVariationSettings: {
      wght: ['200', '700'], // Weight axis
      wdth: ['200', '600'], // Width axis
    },

    fontWeight: {
      extralight: 200,
      light: 350,
      normal: 400,
      semibold: 500,
      bold: 700,
    },

    gridTemplateColumns: false,
    gridColumn: false,
    gridColumnStart: false,
    gridColumnEnd: false,

    extend: {
      aria: {
        current: 'current="page"',
      },

      animation: {
        marquee: 'marquee var(--marquee-time) linear infinite',
        blink: 'blink 0.8s infinite step-end',
      },

      aspectRatio: {
        poster: '2/3',
        logo: '2227/420',
        'mozilla-logo': '704/147',
        'text-topper': '550/686',
      },

      boxShadow: {
        inner: 'inset 0 0 0 1px black',
        'inner-thick': 'inset 0 0 0 4px black',
        'inner-interface': 'inset 0 0 15px 0 rgba(0,0,0,0.2)',
      },

      content: {
        arrow: `url('data:image/svg+xml,<svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M69.4914 37.7055L35.9853 71.2097L2.45057 37.675L6.99568 33.1299L32.834 58.9683L32.8349 3.65135L39.1375 3.65125L39.1366 58.9676L65.0628 33.2765L69.4914 37.7055Z" fill="currentColor"/></svg>')`,
      },

      data: {
        active: 'state=active',
        inactive: 'state=inactive',
        open: 'state=open',
        closed: 'state=closed',
      },

      flex: {
        2: '2 2 0%',
      },

      fontSize: {
        // 10px (@640px) -> 12px (@1536px)
        xs: 'clamp(.625rem, 1vw + 0.7rem, .75rem)',
        // 20px (@640px) -> 24px (@1536px)
        xl: 'clamp(1.25rem, 1.3vw + 0.7rem, 1.5rem)',
        // 24px (@640px) -> 40px (@1536px)
        '2xl': 'clamp(1.5rem, 1.8vw + 0.8rem, 2.5rem)',
        // 32px (@640px) -> 56px (@1536px)
        '4xl': 'clamp(2rem, 2.7vw + 0.9rem, 3.5rem)',
        // 36px (@640px) -> 72px (@1536px)
        '6xl': 'clamp(2.25rem, 4vw + 0.6rem, 4.5rem)',
        // 48px (@640px) -> 100px (@1536px)
        '8xl': 'clamp(3rem, 5.8vw + 0.7rem, 6.25rem)',
        // 56px (@640px) -> 156px (@1536px)
        '10xl': 'clamp(3.5rem, 11.2vw - 1rem, 9.75rem)',
        // 28px (@640px) -> 48px (@1536px)
        subhead: 'clamp(1.5rem, 2.7vw + 0.4rem, 3rem)',
      },

      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(calc(-1 * var(--marquee-width)))' },
        },
        blink: {
          '0%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },

      letterSpacing: {
        tight: '-0.015em',
      },

      lineHeight: {
        tightest: '0.90',
        headline: '0.96',
        tighter: '1.05',
        tight: '1.20',
        snug: '1.35',
      },

      maxWidth: {
        page: 'var(--100vw, 0)',
        'text-narrow': '480px',
      },

      minHeight: {
        screen: '100dvh',
      },

      screens: {
        xs: '480px',
        '3xl': '1700px',
      },

      spacing: {
        'wp-admin-bar': 'var(--wp-admin--admin-bar--height, 0px)',
        // https://fluid-typography.netlify.app/
        site: 'clamp(1rem, 2vw + 0.25rem, 1.5rem)',
        'grid-site-margin': 'var(--grid-site-margin, 0px)',
        'grid-site-gutter': 'var(--grid-site-gutter, 0px)',
        'dither-fade': '173px',
      },

      zIndex: {
        dialog: 100,
      },
    },
  },
  plugins: [
    hocus,
    utilitiesScss({ filename: path.resolve(__dirname, 'static/scss/app.scss') }),
    function ({ addUtilities }) {
      const newUtilities = {
        '.font-wght-100': { 'font-variation-settings': '"wght" 100' },
        '.font-wght-350': { 'font-variation-settings': '"wght" 350' },
        '.font-wght-480': { 'font-variation-settings': '"wght" 480' },
        '.font-wght-700': { 'font-variation-settings': '"wght" 700' },
        '.font-wdth-200': { 'font-variation-settings': '"wdth" 200' },
        '.font-wdth-380': { 'font-variation-settings': '"wdth" 380' },
        '.font-wdth-600': { 'font-variation-settings': '"wdth" 600' },
      };
      addUtilities(newUtilities);
    },
  ],
};
