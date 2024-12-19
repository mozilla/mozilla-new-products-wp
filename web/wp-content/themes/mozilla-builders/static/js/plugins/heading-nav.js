function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, '-');
}

/** @type {import('alpinejs').PluginCallback} */
export function headingNav(Alpine) {
  Alpine.directive('heading-nav', (el, _, { cleanup }) => {
    const unregister = registerRoot(el, Alpine);
    cleanup(() => unregister());
  });
}

/**
 * Registers the root element.
 *
 * @param {HTMLElement}               el
 * @param {import('alpinejs').Alpine} Alpine
 */
function registerRoot(el, Alpine) {
  const article = el.closest('article');
  const headingEls = Array.from(article.querySelectorAll('h1, h2, h3, h4, h5, h6'));

  const headingIdSet = new Set();
  const headings = [];

  headingEls.forEach(heading => {
    const text = heading.innerText;

    let id = heading.id || slugify(text);
    if (headingIdSet.has(id)) {
      id = `${id}-${headingIdSet.size}`;
    }

    heading.id = id;
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
    init() {
      this.observer = new IntersectionObserver(this.onIntersection.bind(this), {
        rootMargin: '0px',
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
      const firstOrIntersectingEntry = entries.find(entry => entry.isIntersecting) || entries[0];

      const entryIndex = this.headings.findIndex(
        heading => heading.id === firstOrIntersectingEntry.target.id,
      );

      if (entryIndex === -1) {
        this.activeIndex = 0;
      } else if (firstOrIntersectingEntry.isIntersecting) {
        this.activeIndex = entryIndex;
      } else {
        this.activeIndex = Math.max(0, Math.min(this.headings.length - 1, entryIndex - 1));
      }
    },
    destroy() {
      this.observer.disconnect();
    },
  }));

  return Alpine.bind(el, () => ({
    'x-data': 'headings',
  }));
}
