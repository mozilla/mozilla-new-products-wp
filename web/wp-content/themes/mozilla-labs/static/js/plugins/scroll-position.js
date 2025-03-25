export function scrollPosition(Alpine) {
  Alpine.directive('scroll-position', el => {
    Alpine.bind(el, {
      'x-init'() {
        el.style.setProperty('--scroll-y', window.scrollY);
      },

      '@scroll.window.throttle'() {
        el.style.setProperty('--scroll-y', window.scrollY);
      },
    });
  });
}
