export function scrollPosition(Alpine) {
  Alpine.directive('scroll-position', el => {
    Alpine.bind(el, {
      'x-init'() {
        el.style.setProperty('--scroll-y', window.scrollY);
      },

      '@scroll.window'() {
        const currentScrollY = el.style.getPropertyValue('--scroll-y');
        el.style.setProperty('--scroll-y', window.scrollY);
        el.setAttribute('data-scroll-direction', currentScrollY < window.scrollY ? 'down' : 'up');

        if (window.scrollY === 0) {
          el.setAttribute('data-scroll-at-top', 'true');
        } else {
          el.removeAttribute('data-scroll-at-top');
        }
      },
    });
  });
}
