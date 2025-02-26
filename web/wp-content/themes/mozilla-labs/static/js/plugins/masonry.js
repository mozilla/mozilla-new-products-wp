/** @type {import('alpinejs').PluginCallback} */
export function masonry(Alpine) {
  Alpine.directive('masonry', (el, { expression }, { cleanup }) => {
    const unregister = registerRoot(el, expression);
    cleanup(() => unregister());
  });
}

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

/**
 * Register the root element for masonry layout
 *
 * @param {HTMLElement} el       - The root element
 * @param {string}      [screen] - The screen size to use (default: md)
 */
function registerRoot(el, screen) {
  const breakpoint = BREAKPOINTS[screen ?? 'md'] ?? BREAKPOINTS.md;
  const rowHeight = 10;
  const rowGap = parseInt(window.getComputedStyle(el).getPropertyValue('grid-row-gap'));

  function resize() {
    if (window.innerWidth >= breakpoint) {
      el.style.gridAutoRows = `${rowHeight}px`;
      Array.from(el.children).forEach(item => {
        const itemContent = item.children[0];

        if (!itemContent) {
          item.style.gridRowEnd = 'auto';
        } else {
          const { height } = itemContent.getBoundingClientRect();
          const rowSpan = Math.ceil((height + rowGap) / (rowHeight + rowGap));
          item.style.gridRowEnd = `span ${rowSpan}`;
        }
      });
    } else {
      el.style.gridAutoRows = 'auto';
      Array.from(el.children).forEach(item => {
        item.style.gridRowEnd = 'auto';
      });
    }
  }

  resize();
  window.addEventListener('resize', resize);

  return () => {
    window.removeEventListener('resize', resize);
    el.style.gridAutoRows = 'auto';
    Array.from(el.children).forEach(item => {
      item.style.gridRowEnd = 'auto';
    });
  };
}
