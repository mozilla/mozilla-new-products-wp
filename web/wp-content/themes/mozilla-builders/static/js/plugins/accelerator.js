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
  // Add path to parent data
  const options = Alpine.$data(el);
  options.pathElement = el;
}

/**
 * Registers the track element to animate the marquee.
 *
 * @param {import('alpinejs').Alpine} Alpine
 * @param {HTMLElement}               el
 */
function registerTargets(Alpine, el) {
  el.dataset.state = 'inactive';

  /** @type {{ pathElement?: HTMLElement }} */
  const options = Alpine.$data(el);
  const pathElement = options.pathElement;
  if (!pathElement) {
    return () => {};
  }

  function getTargets() {
    const children = Array.from(el.children);
    const visibleChildren = children.filter(target => getComputedStyle(target).display !== 'none');
    return visibleChildren;
  }

  // Setup variables
  let animateTimeout;
  const initialDelay = 200;
  const duration = 1600;
  const staggerDelay = 80;

  // Loop through targets and animate
  let targets = getTargets();
  let maxIndex = targets.length - 1;
  const animations = targets.map((target, i) => {
    const percentage = Math.max((i / maxIndex) * 100, 0.01);
    const path = anime.path(pathElement, percentage);
    const initial = anime({
      targets: target,
      translateX: path('x'),
      translateY: path('y'),
      duration,
      delay: anime.stagger(staggerDelay),
      easing: 'easeOutExpo',
    });
    initial.pause();

    return initial;
  });

  // Play initial animation
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQuery.matches) {
    animations.forEach(animation => animation.seek(duration));
    el.dataset.state = 'active';
  } else {
    el.dataset.state = 'active';
    animateTimeout = setTimeout(() => {
      animations.forEach(animation => animation.play());
    }, initialDelay);
  }

  // Pause the animation when reduced motion is enabled or the window is resized
  function finishAnimation() {
    animations.forEach(animation => animation.pause());
    clearTimeout(animateTimeout);

    targets = getTargets();
    maxIndex = targets.length - 1;
    targets.forEach((target, i) => {
      const percentage = Math.max((i / maxIndex) * 100, 0.01);
      const path = anime.path(pathElement, percentage);
      const initial = anime({
        targets: target,
        translateX: path('x'),
        translateY: path('y'),
        duration: 0,
      });
      initial.pause();
    });
  }
  mediaQuery.addEventListener('change', finishAnimation);
  window.addEventListener('resize', finishAnimation);

  // Cleanup
  return () => {
    clearTimeout(animateTimeout);

    window.removeEventListener('resize', finishAnimation);
    mediaQuery.removeEventListener('change', finishAnimation);

    el.dataset.state = 'inactive';
  };
}
