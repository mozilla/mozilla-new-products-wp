// Speed to rotate to the next text.
const ROTATION_SPEED = 2000;

// Speed to type out the text.
const TYPEWRITER_SPEED = 100;

// Speed to instantly type out the text for reduced motion setting.
const TYPEWRITER_INSTANT_SPEED = 600;

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
        index: 0, // Index of the current text to type out.
        texts: [], // Collection of all texts.
        typing: false, // Whether the current text is being typed out.

        next() {
          this.index = (this.index + 1) % this.texts.length;
        },

        isCurrentText(textEl) {
          return this.texts[this.index] === textEl;
        },
      };
    },

    ':aria-busy'() {
      return this.typing ? 'true' : 'false';
    },
  });
}

function handleText(el, Alpine, text) {
  Alpine.bind(el, {
    'x-data'() {
      return {
        characterIndex: 0,
        interval: null,

        reset() {
          this.characterIndex = 0;
          clearInterval(this.interval);
        },

        type() {
          const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
          ).matches;

          if (this.isCurrentText(el)) {
            this.typing = true;

            /**
             * For reduced motion, instantly type out the text
             * instead of typing it out character by character.
             */
            if (prefersReducedMotion) {
              setTimeout(() => {
                this.typing = false;
                el.innerHTML = text;

                setTimeout(() => {
                  el.innerHTML = '';
                  this.next();
                }, ROTATION_SPEED);
              }, TYPEWRITER_INSTANT_SPEED);

              return;
            }

            /**
             * Type out the text character by character.
             */
            this.interval = setInterval(() => {
              if (this.characterIndex >= text.length) {
                this.typing = false;
                this.reset();

                setTimeout(() => {
                  el.innerHTML = '';
                  this.next();
                }, ROTATION_SPEED);

                return;
              }

              el.innerHTML += text[this.characterIndex];
              this.characterIndex++;
            }, TYPEWRITER_SPEED);
          }
        },
      };
    },

    'x-init'() {
      el.innerHTML = '';
      this.texts = this.texts.concat(el);

      Alpine.watch(
        () => this.index,
        () => this.type(),
      );

      this.type();
    },
  });
}
