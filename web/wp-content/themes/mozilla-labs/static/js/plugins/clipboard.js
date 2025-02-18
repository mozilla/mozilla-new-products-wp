/** @type {import('alpinejs').PluginCallback} */
export function clipboard(Alpine) {
  Alpine.data('clipboard', () => ({
    copied: false,
    timeout: null,

    trigger: {
      '@click'() {
        if (this.timeout) {
          clearTimeout(this.timeout);
          this.timeout = null;
        }

        const text = this.$refs.content.textContent;

        if (navigator.clipboard) {
          navigator.clipboard.writeText(text);
        } else {
          const tempInput = document.createElement('input');
          tempInput.value = text;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        this.copied = true;
        this.timeout = setTimeout(() => {
          this.copied = false;
          this.timeout = null;
        }, 2000);
      },
    },

    content: {
      'x-ref': 'content',
    },
  }));

  Alpine.directive('clipboard', (el, { value }, { cleanup }) => {
    if (!value) {
      const unregister = Alpine.bind(el, { 'x-data': 'clipboard' });
      cleanup(() => unregister());
    } else if (value === 'trigger') {
      const unregister = Alpine.bind(el, { 'x-bind': 'trigger' });
      cleanup(() => unregister());
    } else if (value === 'content') {
      const unregister = Alpine.bind(el, { 'x-ref': 'content' });
      cleanup(() => unregister());
    }
  });
}
