/**
 * Page Transitions plugin using Barba.js
 *
 * This plugin requires the following dependency:
 * npm install @barba/core
 *
 * @param {import('alpinejs').Alpine} Alpine
 */
export function pageTransitions(Alpine) {
  // Store the original Alpine.start method
  const originalStart = Alpine.start;

  // Override the Alpine.start method to initialize Barba after Alpine
  Alpine.start = function () {
    // Call the original start method
    originalStart.call(this);

    // Initialize Barba.js
    initBarba(Alpine);
  };
}

/**
 * Initialize Barba.js with page transitions
 *
 * @param {import('alpinejs').Alpine} Alpine
 */
async function initBarba(Alpine) {
  try {
    // Dynamically import Barba.js
    const { default: barba } = await import('@barba/core');

    // Initialize Barba with the dissolve transition
    barba.init({
      transitions: [
        {
          name: 'dissolve-transition',
          leave(data) {
            // Disable smooth scrolling temporarily by adding a class to html
            document.documentElement.classList.add('barba-transition');

            // Fade out the current page
            return dissolveAnimation(data.current.container, 'out');
          },
          beforeEnter() {
            // Reset scroll position to top before the new page appears
            // This happens after the current page has faded out but before the new page starts fading in
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
          },
          enter(data) {
            // Fade in the new page
            return dissolveAnimation(data.next.container, 'in');
          },
          after(data) {
            // Reinitialize Alpine components on the new page
            reinitializeAlpine(Alpine, data.next.container);

            // Re-enable smooth scrolling by removing the class
            document.documentElement.classList.remove('barba-transition');
          },
        },
      ],
    });
  } catch (error) {
    console.error('Failed to initialize Barba.js:', error);
  }
}

/**
 * Dissolve animation for page transitions
 *
 * @param {HTMLElement} container - The container element to animate
 * @param {string}      direction - 'in' for fade in, 'out' for fade out
 * @return {Promise} - Animation promise
 */
function dissolveAnimation(container, direction) {
  return new Promise(resolve => {
    // Set initial opacity
    container.style.opacity = direction === 'in' ? '0' : '1';

    // Ensure the container is visible for the animation
    container.style.position = 'relative';
    container.style.visibility = 'visible';

    // Use requestAnimationFrame for smooth animation
    requestAnimationFrame(() => {
      // Add transition
      container.style.transition = 'opacity 400ms ease';

      // Set target opacity
      container.style.opacity = direction === 'in' ? '1' : '0';

      // Resolve after transition completes
      setTimeout(resolve, 400);
    });
  });
}

/**
 * Reinitialize Alpine.js components in the new page
 *
 * @param {import('alpinejs').Alpine} Alpine
 * @param {HTMLElement}               container - The new page container
 */
function reinitializeAlpine(Alpine, container) {
  // Find all Alpine components in the new container
  const alpineElements = container.querySelectorAll('[x-data]');

  // Initialize each Alpine component
  alpineElements.forEach(el => {
    // Skip elements that are already initialized
    if (el._x_dataStack) {
      return;
    }

    // Initialize the component
    Alpine.initTree(el);
  });
}
