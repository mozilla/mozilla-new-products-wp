function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, '-');
}

/** @type {import('alpinejs').PluginCallback} */
export function headingNav(Alpine) {
  Alpine.directive('headings', (el, { value }, { cleanup }) => {
    if (!value) {
      const unregister = registerRoot(el, Alpine);
      cleanup(() => unregister());
    }
  });
}

/**
 * Registers the root element.
 *
 * @param {HTMLElement}               el
 * @param {import('alpinejs').Alpine} Alpine
 */
function registerRoot(el, Alpine) {
  const content = el.querySelector('[x-headings\\:content]');
  if (!content) {
    return () => {};
  }

  const headingEls = Array.from(content.querySelectorAll('h1, h2, h3, h4, h5, h6'));

  const headingIdSet = new Set();
  const headings = [];

  headingEls.forEach(heading => {
    const text = heading.innerText;

    let id = heading.id || slugify(text);
    if (headingIdSet.has(id)) {
      id = `${id}-${headingIdSet.size}`;
    }

    heading.id = id;
    heading.classList.add('scroll-mt-32');
    headingIdSet.add(id);

    headings.push({
      text,
      id,
      href: `#${id}`,
    });
  });

  Alpine.data('headings', () => ({
    headings,
    activeIndex: 0,
    lastActiveIndex: 0,
    observer: null,
    init() {
      this.observer = new IntersectionObserver(this.onIntersection.bind(this), {
        rootMargin: '0px 0px -80% 0px',
        threshold: 1,
      });

      headingEls.forEach(heading => {
        this.observer.observe(heading);
      });
    },
    /**
     * @param {IntersectionObserverEntry[]} entries
     */
    onIntersection(entries) {
      const intersectingEntry = entries.find(entry => entry.isIntersecting);

      let nextIndex = this.activeIndex;
      if (intersectingEntry) {
        nextIndex = this.headings.findIndex(heading => heading.id === intersectingEntry.target.id);
      }

      this.lastActiveIndex = this.activeIndex;

      if (nextIndex === -1) {
        this.activeIndex = 0;
      } else {
        this.activeIndex = nextIndex;
      }
    },
    destroy() {
      this.observer?.disconnect();
      this.observer = null;
    },
  }));

  return Alpine.bind(el, () => ({
    'x-data': 'headings',
  }));
}
