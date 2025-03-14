export function typewriter(Alpine) {
  Alpine.directive('typewriter', (el, { value, expression }) => {
    if (value === 'text') {
      handleText(el, Alpine, expression);
    } else {
      handleRoot(el, Alpine);
    }
  });
}

function handleRoot(el, Alpine) {
  Alpine.bind(el, {
    'x-data'() {
      return {
        typing: false,
      };
    },

    ':aria-busy'() {
      return this.typing;
    },
  });
}

function handleText(el, Alpine, text) {
  Alpine.bind(el, {
    'x-data'() {
      return {
        character: 0,
      };
    },

    'x-init'() {
      el.innerHTML = '';

      const interval = setInterval(() => {
        this.typing = true;

        if (this.character >= text.length) {
          clearInterval(interval);
          this.typing = false;
          return;
        }

        el.innerHTML += text[this.character];
        this.character++;
      }, 500);
    },
  });
}
