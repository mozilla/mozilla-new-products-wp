export function videoEmbed(Alpine) {
  Alpine.directive('video-embed', (el, { value }) => {
    if (value === 'cover') {
      handleCover(el, Alpine);
    } else if (value === 'play') {
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
  });
}
function handleCover(el, Alpine) {
  Alpine.bind(el, {
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
