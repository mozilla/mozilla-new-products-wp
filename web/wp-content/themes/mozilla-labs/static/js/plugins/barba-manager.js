import barba from '@barba/core';
import gsap from 'gsap';

export function initBarba(config) {
  const { Alpine, duration } = config;

  // Store scroll positions keyed by URL
  const scrollPositions = {};

  // Store current scroll position before navigation
  barba.hooks.before(() => {
    scrollPositions[window.location.href] = window.scrollY;
  });

  try {
    barba.init({
      debug: true,
      prevent: ({ el }) => {
        // Check if the clicked element is inside the WordPress admin bar
        const adminBar = document.getElementById('wpadminbar');
        return adminBar && (el.id === 'wpadminbar' || adminBar.contains(el));
      },
      transitions: [
        {
          name: 'dissolve-transition',
          sync: false,

          leave(data) {
            document.documentElement.classList.add('barba-transition');
            return fadeAnimation(data.current.container, 'out', duration);
          },

          afterLeave(data) {
            // Check if this is a back/forward navigation
            const isBackNavigation = data.trigger === 'popstate';

            // Only scroll to top for new navigation, not back button
            if (!isBackNavigation) {
              window.scrollTo(0, 0);
              document.documentElement.scrollTop = 0;
              document.body.scrollTop = 0;
            }
          },

          beforeEnter(data) {
            // gsap.set(data.next.container, { opacity: 0 });

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

          after(data) {
            document.documentElement.classList.remove('barba-transition');

            // Check if this is a back/forward navigation
            const isBackNavigation = data.trigger === 'popstate' || data.trigger === 'back';

            if (isBackNavigation) {
              // Restore scroll position for back navigation
              const savedPosition = scrollPositions[window.location.href] || 0;
              // console.log(`restoring to ${savedPosition}`, scrollPositions);
              // Use setTimeout to ensure the scroll happens after the page is fully rendered
              setTimeout(() => {
                window.scrollTo(0, savedPosition);
              }, 10);
            }
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
