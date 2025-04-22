function dispatch(el, name, detail) {
  const event = new CustomEvent(name, { detail });
  el.dispatchEvent(event);
}

/**
 * `x-dialog` set of directives creates a window overlaid
 * on top of a page window, rendering the content underneath inert.
 *
 * @param {import('alpinejs').Alpine} Alpine
 */
export function dialog(Alpine) {
  Alpine.directive('dialog', (el, { value }) => {
    if (value === 'trigger') {
      handleTrigger(el, Alpine);
    } else if (value === 'content') {
      handleContent(el, Alpine);
    } else if (value === 'overlay') {
      handleOverlay(el, Alpine);
    } else if (value === 'title') {
      handleTitle(el, Alpine);
    } else if (value === 'description') {
      handleDescription(el, Alpine);
    } else if (value === 'close') {
      handleClose(el, Alpine);
    } else {
      handleRoot(el, Alpine);
    }
  });
}

function handleRoot(el, Alpine) {
  Alpine.bind(el, {
    'x-data'() {
      return {
        open: false,
        __root: el,
      };
    },

    'x-id'() {
      return ['tb-dialog-content', 'tb-dialog-title', 'tb-dialog-description'];
    },

    ':data-state'() {
      return this.open ? 'open' : 'closed';
    },

    'x-effect'() {
      dispatch(el, 'dialog:change', { open: this.open });
    },
  });
}

function handleTrigger(el, Alpine) {
  Alpine.bind(el, {
    '@click'() {
      this.open = !this.open;
    },

    ':aria-expanded'() {
      return this.open ? true : false;
    },

    ':data-state'() {
      return this.open ? 'open' : 'closed';
    },

    'aria-haspopup': 'dialog',

    ':aria-controls'() {
      return this.$id('tb-dialog-content');
    },

    'x-effect'() {
      dispatch(el, 'dialog:change', { open: this.open });
    },
  });
}

function handleContent(el, Alpine) {
  Alpine.bind(el, {
    'x-data'() {
      return {
        __content: el,
      };
    },

    ':id'() {
      return this.$id('tb-dialog-content');
    },

    role: 'dialog',

    tabindex: -1,

    'aria-modal': true,

    ':aria-labelledby'() {
      return this.$id('tb-dialog-title');
    },

    ':aria-describedby'() {
      return this.$id('tb-dialog-description');
    },

    ':data-state'() {
      return this.open ? 'open' : 'closed';
    },

    'x-show'() {
      return this.open;
    },

    'x-trap.noscroll.inert'() {
      return this.open;
    },

    '@keydown.escape.prevent.stop'() {
      this.open = false;
    },

    'x-effect'() {
      dispatch(el, 'dialog:change', { open: this.open });
    },
  });
}

function handleOverlay(el, Alpine) {
  Alpine.bind(el, {
    'x-show'() {
      return this.open;
    },

    '@click'() {
      this.open = false;
    },

    'aria-hidden': true,
  });
}

function handleTitle(el, Alpine) {
  Alpine.bind(el, {
    ':id'() {
      return this.$id('tb-dialog-title');
    },
  });
}

function handleDescription(el, Alpine) {
  Alpine.bind(el, {
    ':id'() {
      return this.$id('tb-dialog-description');
    },
  });
}

function handleClose(el, Alpine) {
  Alpine.bind(el, {
    '@click'() {
      this.open = false;
    },
  });
}
