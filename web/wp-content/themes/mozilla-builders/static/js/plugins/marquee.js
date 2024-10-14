/** @type {import('alpinejs').PluginCallback} */
export function marquee(Alpine) {
  Alpine.directive('marquee', (el, { value, expression }, { evaluate, cleanup }) => {
    if (!value) {
      const options = evaluate(expression);
      const unregister = registerRoot(Alpine, el, options.speed ?? 1);
      cleanup(() => unregister());
    } else if (value === 'track') {
      const unregister = registerTrack(Alpine, el);
      cleanup(() => unregister());
    }
  });
}

/**
 * Registers the root element with speed and spaceX options
 *
 * @param {import('alpinejs').Alpine} Alpine
 * @param {HTMLElement} el
 * @param {number} speed
 */
function registerRoot(Alpine, el, speed) {
  return Alpine.bind(el, {
    'x-data': () => ({ __root: el, speed }),
  });
}

/**
 * @param {Function} func
 * @param {number} timeout
 */
function debounce(func, timeout = 100) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

/**
 * Resizes the marquee to fit the screen
 *
 * @param {HTMLElement} rootElement
 * @param {HTMLElement} el
 * @param {HTMLElement} originalElement
 */
async function resize(rootElement, el, originalElement) {
  // Reset to original number of elements
  el.innerHTML = originalElement.innerHTML;
  // Keep cloning elements until marquee starts to overflow
  do {
    originalElement.childNodes.forEach(child => el.appendChild(child.cloneNode(true)));
  } while (el.scrollWidth < rootElement.clientWidth);

  originalElement.childNodes.forEach(child => el.appendChild(child.cloneNode(true)));
}

/**
 * Registers the track element to animate the marquee.
 *
 * @param {import('alpinejs').Alpine} Alpine
 * @param {HTMLElement} el
 */
function registerTrack(Alpine, el) {
  const options = Alpine.$data(el);
  const { speed, __root: rootElement } = options;

  // Store the original element so we can restore it on screen resize later
  const originalElement = el.cloneNode(true);
  const originalWidth = el.scrollWidth;
  // Required for the marquee scroll animation
  // to loop smoothly without jumping
  rootElement.style.setProperty('--marquee-width', `${originalWidth}px`);
  rootElement.style.setProperty('--marquee-time', `${((1 / speed) * originalWidth) / 100}s`);

  const onResize = () => {
    resize(rootElement, el, originalElement);
  };

  onResize();
  const listener = debounce(onResize);
  window.addEventListener('resize', listener);

  rootElement.classList.add('loaded');

  return () => {
    rootElement.classList.remove('loaded');
    rootElement.style.removeProperty('--marquee-width');
    rootElement.style.removeProperty('--marquee-time');
    window.removeEventListener('resize', listener);
  };
}
