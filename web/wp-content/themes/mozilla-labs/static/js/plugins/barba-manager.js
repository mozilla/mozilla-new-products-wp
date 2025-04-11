import barba from '@barba/core';
import gsap from 'gsap';

export function initBarba(config) {
  const { duration } = config;

  // Store scroll positions keyed by URL path (without hash)
  const scrollPositions = {};

  // Helper function to get a consistent URL key (without hash)
  const getUrlKey = url => {
    // Create URL object to easily manipulate parts
    const urlObj = new URL(url);
    // Return origin + pathname + search (no hash)
    return urlObj.origin + urlObj.pathname + urlObj.search;
  };

  try {
    barba.init({
      debug: false,
      prevent: ({ el }) => {
        // Check if the clicked element is inside the WordPress admin bar
        const adminBar = document.getElementById('wpadminbar');
        return adminBar && (el.id === 'wpadminbar' || adminBar.contains(el));
      },
      // Handle 404 errors with a hard redirect
      requestError: (trigger, action, url, response) => {
        // If it's a 404 error or any other error, perform a hard redirect
        if (response && (response.status === 404 || response.status >= 400)) {
          window.location.href = url.href;
          return false; // Prevent Barba from handling the transition
        }
        // For other cases, let Barba handle it
        return true;
      },
      transitions: [
        {
          name: 'dissolve-transition',
          sync: false,

          leave(data) {
            document.documentElement.classList.add('barba-transition');

            // Save scroll position for the current page before leaving
            const currentUrl = getUrlKey(data.current.url.href);
            scrollPositions[currentUrl] = window.scrollY;

            return fadeAnimation(data.current.container, 'out', duration);
          },

          afterLeave(data) {
            // Check if this is a back/forward navigation
            const isBackNavigation =
              data.trigger === 'popstate' || data.trigger === 'back' || data.trigger === 'forward';

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
            // Check if this is a back/forward navigation
            const isBackNavigation =
              data.trigger === 'popstate' || data.trigger === 'back' || data.trigger === 'forward';

            if (isBackNavigation) {
              // Get the current URL key from the data object
              const currentUrl = getUrlKey(data.next.url.href);

              // Restore scroll position for back navigation
              const savedPosition = scrollPositions[currentUrl] || 0;
              // console.log(`Restoring to ${savedPosition} for ${currentUrl}`, scrollPositions);

              // Store original scroll behavior
              const originalScrollBehavior = document.documentElement.style.scrollBehavior;

              // Disable smooth scrolling at the CSS level
              document.documentElement.style.scrollBehavior = 'auto';

              // Try to scroll immediately
              window.scrollTo(0, savedPosition);
              document.documentElement.scrollTop = savedPosition;
              document.body.scrollTop = savedPosition;

              // Also use setTimeout as a fallback to ensure the scroll happens after the page is fully rendered
              setTimeout(() => {
                // Ensure smooth scrolling is still disabled
                document.documentElement.style.scrollBehavior = 'auto';

                // Force scroll with all possible methods
                window.scrollTo(0, savedPosition);
                document.documentElement.scrollTop = savedPosition;
                document.body.scrollTop = savedPosition;

                // Restore original scroll behavior after a delay
                setTimeout(() => {
                  document.documentElement.style.scrollBehavior = originalScrollBehavior;
                }, 100);
              }, 10);
            }

            return fadeAnimation(data.next.container, 'in', duration);
          },

          after() {
            document.documentElement.classList.remove('barba-transition');
          },
        },
      ],
    });

    barba.hooks.leave(() => {
      document.querySelectorAll('[x-data]').forEach(el => {
        el.removeAttribute('x-data');
      });
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
