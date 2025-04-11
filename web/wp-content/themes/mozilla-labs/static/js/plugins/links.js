import barba from '@barba/core';

/** @type {import('alpinejs').PluginCallback} */
export function links(Alpine) {
  Alpine.directive('links', registerRoot);
}

/**
 * Registers the root element.
 *
 * @param {HTMLElement} el
 */
function registerRoot(el) {
  initialize(el);

  barba.hooks.after(() => {
    initialize(el);
  });
}

/**
 * Registers the root element.
 *
 * @param {HTMLElement} el
 */
function initialize(el) {
  const allLinks = Array.from(el.querySelectorAll('a'));

  if (allLinks.length > 0) {
    allLinks.forEach(link => {
      if (link.host !== window.location.host) {
        link.setAttribute('rel', 'noopener noreferrer');
        link.setAttribute('target', '_blank');
      }
    });
  }
}
