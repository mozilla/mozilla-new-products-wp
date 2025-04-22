export function videoEmbed(Alpine) {
  Alpine.directive('video-embed', (el, { value }) => {
    if (value === 'play') {
      handlePlay(el, Alpine);
    } else {
      handleRoot(el, Alpine);
    }
  });
}

function handleRoot(el, Alpine) {
  Alpine.bind(el, {
    'x-data'() {
      return {
        playing: false,
      };
    },

    ':data-playing'() {
      return this.playing;
    },
  });
}

function handlePlay(el, Alpine) {
  Alpine.bind(el, {
    '@click'() {
      this.playing = true;
    },

    ':data-playing'() {
      return this.playing;
    },
  });
}
