/**
 * `x-tabs` is a set of layered sections of content known
 * as tab panels that are displayed one at a time.
 *
 * @param {import('alpinejs').Alpine} Alpine
 */
export function tabs(Alpine) {
  Alpine.directive('tabs', (el, { value, modifiers, expression }, { evaluate }) => {
    if (value === 'list') {
      handleList(el, Alpine, {
        loop: modifiers.includes('loop'),
        automatic: modifiers.includes('automatic'),
        orientation: modifiers.includes('vertical') ? 'vertical' : 'horizontal',
      });
    } else if (value === 'tab') {
      handleTab(el, Alpine, { value: expression });
    } else if (value === 'panel') {
      handlePanel(el, Alpine, { value: expression });
    } else {
      handleRoot(el, Alpine, evaluate(expression));
    }
  });
}

/**
 * @param {HTMLElement}               el
 * @param {import('alpinejs').Alpine} Alpine
 * @param {{ default: string }}       config
 */
function handleRoot(el, Alpine, config) {
  Alpine.bind(el, {
    'x-data'() {
      return {
        __root: el,

        tabs: [],
        defaultTab: config?.default || null,
        activeTab: config?.initial || null,
      };
    },

    'x-id'() {
      return ['tb-tabs-tab', 'tb-tabs-panel'];
    },

    'x-effect'() {
      // Update query params
      if (this.activeTab) {
        const params = new URLSearchParams(window.location.search);
        params.set('tab', this.activeTab);
        if (this.activeTab === this.defaultTab) {
          params.delete('tab');
        }
        const pathname = window.location.pathname;
        const search = params.size > 0 ? `?${params.toString()}` : '';
        window.history.replaceState(null, '', `${pathname}${search}`);
      }
    },
  });
}

/**
 * @param {HTMLElement}                                                                   el
 * @param {import('alpinejs').Alpine}                                                     Alpine
 * @param {{ loop: boolean, automatic: boolean, orientation: 'horizontal' | 'vertical' }} config
 */
function handleList(el, Alpine, config) {
  Alpine.bind(el, {
    'x-init'() {
      if (!this.__root) {
        console.error('x-tabs:tab must be placed inside an x-tabs.', el);
      }
    },

    'x-data'() {
      return {
        __list: el,
        loop: config.loop || false,
        automatic: config.automatic || false,
        orientation: config.orientation || 'horizontal',
      };
    },

    role: 'tablist',

    tabindex: 0,
  });
}

/**
 * @param {HTMLElement}               el
 * @param {import('alpinejs').Alpine} Alpine
 * @param {{ value: string }}         config
 */
function handleTab(el, Alpine, config) {
  if (!config.value) {
    return console.error('x-tabs:tab must have a value.', el);
  }

  Alpine.bind(el, {
    'x-data'() {
      return {
        value: config.value,
      };
    },

    'x-init'() {
      if (!this.__list) {
        console.error('x-tabs:tab must be placed inside an x-tabs:list.', el);
      }

      if (el.tagName !== 'BUTTON') {
        console.error('x-tabs:tab must be a <button> element.', el);
      }

      // Assume this tab is the first if there is no active tab.
      if (!this.activeTab) {
        this.activeTab = this.value;
      }

      this.tabs.push(el);
    },

    ':id'() {
      return `${this.$id('tb-tabs-tab')}-${this.value}`;
    },

    role: 'tab',

    ':tabindex'() {
      return this.activeTab === this.value ? '0' : -1;
    },

    ':aria-selected'() {
      return this.activeTab === this.value;
    },

    ':aria-controls'() {
      return `${this.$id('tb-tabs-panel')}-${this.value}`;
    },

    ':data-state'() {
      return this.activeTab === this.value ? 'active' : 'inactive';
    },

    '@click'() {
      this.activeTab = this.value;
    },

    '@keydown.home.prevent.stop'() {
      const tab = this.tabs.at(0);

      if (tab) {
        tab.focus();
      }

      if (tab && this.automatic) {
        tab.click();
      }
    },

    '@keydown.end.prevent.stop'() {
      const tab = this.tabs.at(-1);

      if (tab) {
        tab.focus();
      }

      if (tab && this.automatic) {
        tab.click();
      }
    },

    '@keydown.left.prevent.stop'() {
      if (this.orientation === 'horizontal') {
        const index = this.tabs.indexOf(el);

        if (index >= 0) {
          const next = this.loop ? index - 1 : Math.max(index - 1, 0);
          const tab = this.tabs.at(next);

          if (tab) {
            tab.focus();
          }

          if (tab && this.automatic) {
            tab.click();
          }
        }
      }
    },

    '@keydown.right.prevent.stop'() {
      if (this.orientation === 'horizontal') {
        const index = this.tabs.indexOf(el);

        if (index >= 0) {
          const previous = this.loop
            ? (index + 1) % this.tabs.length
            : Math.min(index + 1, this.tabs.length - 1);

          const tab = this.tabs.at(previous);

          if (tab) {
            tab.focus();
          }

          if (tab && this.automatic) {
            tab.click();
          }
        }
      }
    },

    '@keydown.up.prevent.stop'() {
      if (this.orientation === 'vertical') {
        const index = this.tabs.indexOf(el);

        if (index >= 0) {
          const next = this.loop ? index - 1 : Math.max(index - 1, 0);
          const tab = this.tabs.at(next);

          if (tab) {
            tab.focus();
          }

          if (tab && this.automatic) {
            tab.click();
          }
        }
      }
    },

    '@keydown.down.prevent.stop'() {
      if (this.orientation === 'vertical') {
        const index = this.tabs.indexOf(el);

        if (index >= 0) {
          const previous = this.loop
            ? (index + 1) % this.tabs.length
            : Math.min(index + 1, this.tabs.length - 1);

          const tab = this.tabs.at(previous);

          if (tab) {
            tab.focus();
          }

          if (tab && this.automatic) {
            tab.click();
          }
        }
      }
    },
  });
}

/**
 * @param {HTMLElement}               el
 * @param {import('alpinejs').Alpine} Alpine
 * @param {{ value: string }}         config
 */
function handlePanel(el, Alpine, config) {
  if (!config.value) {
    return console.error('x-tabs:panel must have a value.', el);
  }

  Alpine.bind(el, {
    'x-init'() {
      if (!this.__root) {
        console.error('x-tabs:panel must be placed inside an x-tabs', el);
      }
    },

    'x-data'() {
      return {
        value: config.value,
      };
    },

    ':id'() {
      return `${this.$id('tb-tabs-panel')}-${this.value}`;
    },

    role: 'tabpanel',

    ':tabindex'() {
      return this.activeTab === this.value ? '0' : -1;
    },

    ':data-state'() {
      return this.activeTab === this.value ? 'active' : 'inactive';
    },

    ':aria-labelledby'() {
      return `${this.$id('tb-tabs-tab')}-${this.value}`;
    },

    'x-show'() {
      return this.activeTab === this.value;
    },
  });
}
