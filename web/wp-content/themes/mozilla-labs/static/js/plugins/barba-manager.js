import barba from '@barba/core';
import gsap from 'gsap';

export function initBarba(config) {
  const { Alpine, duration } = config;

  try {
    barba.init({
      debug: true,
      prevent: ({ el }) => {
        // Check if the clicked element or any of its parents is inside the WordPress admin bar
        let currentElement = el;
        while (currentElement) {
          if (currentElement.id === 'wpadminbar' || currentElement.closest('#wpadminbar')) {
            return true; // Prevent Barba from handling this link
          }
          currentElement = currentElement.parentElement;
        }
        return false; // Otherwise allow Barba to handle link
      },
      transitions: [
        {
          name: 'dissolve-transition',
          sync: false,

          leave(data) {
            document.documentElement.classList.add('barba-transition');
            return fadeAnimation(data.current.container, 'out', duration);
          },

          afterLeave() {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
          },

          beforeEnter(data) {
            gsap.set(data.next.container, { opacity: 0 });

            // Parse the next page's HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.next.html, 'text/html');

            // Copy body classes from the next page to the current container
            const nextPageBodyClasses = doc.querySelector('body').className;
            document.body.className = nextPageBodyClasses;

            // Copy header classes from the next page to the current header
            const nextPageHeaderClasses = doc.querySelector('header').className;
            const headerElement = document.querySelector('header');
            if (headerElement) {
              headerElement.className = nextPageHeaderClasses;
            }

            // Copy the content of the <nav> element from the next page to the current page
            const nextPageNav = doc.querySelector('nav');
            const currentPageNav = document.querySelector('nav');
            if (nextPageNav && currentPageNav) {
              currentPageNav.innerHTML = nextPageNav.innerHTML;
            }

            // Update WordPress admin bar
            const nextPageAdminBar = doc.querySelector('#wpadminbar');
            const currentAdminBar = document.querySelector('#wpadminbar');
            if (nextPageAdminBar && currentAdminBar) {
              currentAdminBar.innerHTML = nextPageAdminBar.innerHTML;
            }
          },

          enter(data) {
            // Re-initialize Alpine
            Alpine.start();
            return fadeAnimation(data.next.container, 'in', duration);
          },

          after() {
            document.documentElement.classList.remove('barba-transition');
          },
        },
      ],
    });
  } catch (error) {
    console.error('Failed to initialize Barba.js:', error);
  }
}

function fadeAnimation(container, direction, duration) {
  return new Promise(resolve => {
    gsap.set(container, {
      opacity: direction === 'in' ? 0 : 1,
    });
    gsap.to(container, {
      opacity: direction === 'in' ? 1 : 0,
      duration,
      ease: 'power1.inOut',
      onComplete: () => {
        if (direction === 'out') {
          gsap.set(container, { display: 'none' });
        }
        resolve();
      },
    });
  });
}
