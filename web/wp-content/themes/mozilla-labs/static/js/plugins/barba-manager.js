import barba from '@barba/core';
import gsap from 'gsap';

export function initBarba(config) {
  const { Alpine } = config;

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
        return false; // Allow Barba to handle this link
      },
      transitions: [
        {
          name: 'dissolve-transition',
          sync: false,

          leave(data) {
            document.documentElement.classList.add('barba-transition');
            return fadeAnimation(data.current.container, 'out');
          },

          afterLeave() {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
          },

          beforeEnter(data) {
            gsap.set(data.next.container, { opacity: 0 });
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.next.html, 'text/html');
            const nextPageBodyClasses = doc.querySelector('body').className;
            document.body.className = nextPageBodyClasses;
            const nextPageHeaderClasses = doc.querySelector('header').className;
            const headerElement = document.querySelector('header');
            if (headerElement) {
              headerElement.className = nextPageHeaderClasses;
            }
            const nextPageNav = doc.querySelector('nav');
            const currentPageNav = document.querySelector('nav');
            if (nextPageNav && currentPageNav) {
              currentPageNav.innerHTML = nextPageNav.innerHTML;
            }
          },

          enter(data) {
            // Initialize Alpine only for the new container's elements
            Alpine.start();
            return fadeAnimation(data.next.container, 'in');
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

function fadeAnimation(container, direction) {
  return new Promise(resolve => {
    gsap.set(container, {
      opacity: direction === 'in' ? 0 : 1,
    });
    gsap.to(container, {
      opacity: direction === 'in' ? 1 : 0,
      duration: 0.25,
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
