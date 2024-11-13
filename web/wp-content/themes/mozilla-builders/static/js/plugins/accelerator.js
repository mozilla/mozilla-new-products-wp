import anime from 'animejs';

/** @type {import('alpinejs').PluginCallback} */
export function accelerator(Alpine) {
  Alpine.directive('accelerator', (el, { value }, { cleanup }) => {
    if (!value) {
      const unregister = registerRoot(Alpine, el);
      cleanup(() => unregister());
    } else if (value === 'path') {
      const unregister = registerPath(Alpine, el);
      cleanup(() => unregister());
    } else if (value === 'targets') {
      const unregister = registerTargets(Alpine, el);
      cleanup(() => unregister());
    }
  });
}

/**
 * Registers the track element to animate the marquee.
 *
 * @param {import('alpinejs').Alpine} Alpine
 * @param {HTMLElement}               el
 */
function registerRoot(Alpine, el) {
  return Alpine.bind(el, {
    'x-data': () => ({ __root: el }),
  });
}

/**
 * Registers the track element to animate the marquee.
 *
 * @param {import('alpinejs').Alpine} Alpine
 * @param {HTMLElement}               el
 */
function registerPath(Alpine, el) {
  const path = anime.path(el);

  // Add path to parent data
  const options = Alpine.$data(el);
  options.path = path;
}

/**
 * Registers the track element to animate the marquee.
 *
 * @param {import('alpinejs').Alpine} Alpine
 * @param {HTMLElement}               el
 */
function registerTargets(Alpine, el) {
  const options = Alpine.$data(el);
  /** @type {ReturnType<typeof anime.path>} */
  const path = options.path;

  // Setup
  const targets = Array.from(el.children);
  const numTargets = targets.length;
  const staggerDelay = 80;
  const duration = staggerDelay * numTargets * 16;
  const minSeek = duration - staggerDelay * numTargets;
  const seekStart = minSeek + Math.floor(Math.random() * duration);

  // Loop through targets and animate
  const animations = targets.map((target, i) => {
    const initial = anime({
      targets: target,
      translateX: path('x'),
      translateY: path('y'),
      duration,
      easing: 'linear',
      loop: true,
    });
    initial.pause();

    const delay = staggerDelay * (numTargets - i);
    const seek = (seekStart - delay) % duration;
    initial.seek(seek);

    return initial;
  });

  // Show animation
  el.dataset.play = true;

  // Handle reduced motion
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  function onReducedMotionChange(event) {
    const reducedMotion = event.matches;
    if (reducedMotion) {
      animations.forEach(animation => animation.pause());
    } else {
      animations.forEach(animation => animation.play());
    }
  }
  onReducedMotionChange(mediaQuery);
  mediaQuery.addEventListener('change', onReducedMotionChange);

  // Cleanup
  return () => {
    mediaQuery.removeEventListener('change', onReducedMotionChange);
  };
}
