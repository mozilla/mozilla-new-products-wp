/**
 * Page Transitions plugin using Barba.js and GSAP
 *
 * This plugin requires the following dependencies:
 * npm install @barba/core gsap
 *
 * @param {import('alpinejs').Alpine} Alpine
 */
import barba from '@barba/core';
import gsap from 'gsap';

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
function initBarba(Alpine) {
  try {
    // Initialize Barba with the dissolve transition
    barba.init({
      transitions: [
        {
          name: 'dissolve-transition',
          // Ensure transitions happen in sequence, not simultaneously
          sync: false,

          leave(data) {
            // Disable smooth scrolling temporarily by adding a class to html
            document.documentElement.classList.add('barba-transition');

            // Fade out the current page
            return fadeAnimation(data.current.container, 'out');
          },

          // This hook runs after leave completes and before enter starts
          afterLeave() {
            // Reset scroll position to top before the new page appears
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
          },

          // This hook runs after the next container has been added to the DOM
          beforeEnter(data) {
            // Hide the new container initially
            gsap.set(data.next.container, { opacity: 0 });

            // parse the data.next.html string to a DOM element
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.next.html, 'text/html');

            // Copy body classes from the next page to the current container
            const nextPageBodyClasses = doc.querySelector('body').className;
            document.body.className = nextPageBodyClasses;

            // Also copy the classe from the header element
            const nextPageHeaderClasses = doc.querySelector('header').className;
            document.querySelector('header').className = nextPageHeaderClasses;

            // Also, copy over the content of the <nav> element
            const nextPageNav = doc.querySelector('nav');
            const currentPageNav = document.querySelector('nav');
            if (nextPageNav && currentPageNav) {
              currentPageNav.innerHTML = nextPageNav.innerHTML;
            }
          },

          enter(data) {
            // Fade in the new page
            return fadeAnimation(data.next.container, 'in');
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
 * Simple fade animation using GSAP
 *
 * @param {HTMLElement} container - The container to animate
 * @param {string}      direction - 'in' or 'out'
 * @return {Promise} - Animation promise
 */
function fadeAnimation(container, direction) {
  return new Promise(resolve => {
    // Set initial opacity based on direction
    gsap.set(container, {
      opacity: direction === 'in' ? 0 : 1,
    });

    // Animate with GSAP
    gsap.to(container, {
      opacity: direction === 'in' ? 1 : 0,
      duration: 0.25,
      ease: 'power1.inOut',
      onComplete: () => {
        // After fade out completes, set display to none to remove from layout flow
        if (direction === 'out') {
          gsap.set(container, { display: 'none' });
        }
        resolve();
      },
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
