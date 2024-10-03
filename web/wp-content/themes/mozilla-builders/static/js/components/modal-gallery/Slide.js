import { StateMachine, on } from '@src/utils';
import { KEY_CODES } from '@src/utils/constants';
import { TARGET_CLASSES } from './constants';

const STATE = {
  unmounted: 'unmounted',
  beforeMount: 'beforeMount',
  mounted: 'mounted',
  beforeUnmount: 'beforeUnmount',
};

const VIDEO_LABELS = {
  play: 'Play',
  pause: 'Pause',
  ariaPlay: 'Play Video',
  ariaPause: 'Pause Video',
};

class Slide {
  /**
   * Creates a new slide for the modal gallery.
   *
   * @param {HTMLImageElement|HTMLVideoElement} ref the original reference to the image or video element
   * on the page
   */
  constructor(ref) {
    this.stateManager = new StateMachine(STATE.unmounted, {
      [STATE.unmounted]: [STATE.beforeMount],
      [STATE.beforeMount]: [STATE.mounted],
      [STATE.mounted]: [STATE.beforeUnmount],
      [STATE.beforeUnmount]: [STATE.unmounted],
    });

    this.ref = ref;
    this.wrapper = null;
    this.button = null;
    this.el = null; // the media element (img/video)
    this.videoPoster = null;

    this.initialize();
    this.mount();
  }

  initialize() {
    // Clone the ref to display it in the slide and give it our custom class
    this.el = this.ref.cloneNode(true);
    this.el.className = TARGET_CLASSES.slideAsset;

    if (this.isVideo) {
      this.videoPoster = document.createElement('img');
      this.videoPoster.src = this.ref.poster;
    } else {
      // For image sizes
      this.el.src = this.ref.dataset.src || this.ref.src;
      this.el.srcset = this.ref.dataset.srcset || this.ref.srcset;
      this.el.sizes = this.ref.dataset.sizes || this.ref.sizes;
    }
  }

  /**
   * @type {boolean} whether the slide is currently mounted
   */
  get isMounted() {
    return this.stateManager.isStateOneOf([STATE.beforeMount, STATE.mounted, STATE.beforeUnmount]);
  }

  /**
   * @type {HTMLImageElement} the preview to show for inactive slides
   */
  get preview() {
    if (this.isVideo) {
      return this.videoPoster;
    }
    return this.el;
  }

  /**
   * @type {boolean} whether the slide is a video
   */
  get isVideo() {
    return this.ref instanceof HTMLVideoElement;
  }

  /**
   * @type {string} the slide's media caption
   */
  get caption() {
    return this.ref.dataset.caption || '';
  }

  /**
   * @type {string} the slide's media credit
   */
  get credit() {
    return this.ref.dataset.credit || '';
  }

  /**
   * Callback before the slide is mounted. Wraps the media reference in a `span` for
   * adding the open button.
   */
  _beforeMount() {
    const wrapper = document.createElement('span');
    wrapper.classList.add(TARGET_CLASSES.trigger);

    // If the media item isn't absolutely positioned, add a relative class
    // to position the wrapper element correctly
    if (window.getComputedStyle(this.ref).position !== 'absolute') {
      wrapper.classList.add('relative');
    }

    let videoOverlay = null;
    const isFromVideoBlock = this.ref.parentNode.classList.contains('wp-block-video');

    if (this.isVideo && isFromVideoBlock) {
      wrapper.classList.add('video');
      videoOverlay = this.createVideoOverlayElem();
    }

    // Add the <span> wrapper around the media element
    this.ref.parentNode.insertBefore(wrapper, this.ref);

    // Append the media element to the wrapper
    wrapper.append(this.ref);

    // Append the video overlay and play the video
    if (videoOverlay) {
      wrapper.append(videoOverlay);
      this.ref.play();
    }

    this.wrapper = wrapper;
  }

  /**
   * Mounts the slide to the DOM. If the slide is already mounted, an error
   * is thrown.
   */
  mount() {
    if (this.isMounted) {
      throw new Error('Slide is already mounted!');
    }

    this.stateManager.setState(STATE.beforeMount);
    this._beforeMount();
    this.stateManager.setState(STATE.mounted);
  }

  /**
   * Unwraps the media reference, removes the wrapper, and resets both the wrapper and button.
   */
  _beforeUnmount() {
    this.wrapper.parentNode.insertBefore(this.wrapper, this.ref);
    this.wrapper.parentNode.removeChild(this.wrapper);
    this.button = null;
    this.wrapper = null;
  }

  /**
   * Unmounts the slide from the DOM, if the slide was mounted.
   */
  unmount() {
    if (this.stateManager.state === STATE.mounted) {
      this.stateManager.setState(STATE.beforeUnmount);
      this._beforeUnmount();
      this.stateManager.setState(STATE.unmounted);
    }
  }

  /**
   * Retrieves the slide's open button or, if it doesn't exist, creates one.
   *
   * @returns {HTMLButtonElement} the open button, or `null` if the slide isn't mounted
   */
  getOrCreateOpenButton() {
    if (this.stateManager.state !== STATE.mounted) {
      return null;
    } else if (!this.button) {
      const button = document.createElement('button');

      button.setAttribute('aria-label', 'Open modal gallery');
      button.classList.add(TARGET_CLASSES.open);

      this.wrapper.append(button);
      this.button = button;
    }
    return this.button;
  }

  /**
   * Renders the slide to the given element.
   *
   * @param {HTMLElement} element the element to render to
   * @param {boolean} [active=false] whether the slide is currently active
   * @returns {HTMLImageElement|HTMLVideoElement} the rendered slide
   */
  renderTo(element, active = false) {
    if (this.stateManager.state !== STATE.mounted || !element) {
      return null;
    }

    if (active) {
      element.appendChild(this.el);

      // Append the video overlay and play the video from the beginning
      if (this.isVideo) {
        const videoOverlay = this.createVideoOverlayElem();
        element.append(videoOverlay);

        this.el.currentTime = 0;
        this.el.play();
      }

      return;
    }

    return element.appendChild(this.preview);
  }

  /**
   * Returns overlay div allow video play/pause functionality
   *
   * @returns {HTMLElement} video overlay div with button
   */
  createVideoOverlayElem() {
    // Add a focusable overlay on top of the video element to allow play/pause functionality
    const videoOverlay = document.createElement('div');
    videoOverlay.classList.add(TARGET_CLASSES.videoOverlay);
    videoOverlay.setAttribute('tabindex', '0');
    videoOverlay.setAttribute('role', 'button');
    videoOverlay.setAttribute('aria-label', VIDEO_LABELS.ariaPause);

    // Add event listeners for the video overlay for toggling play/pause
    on(videoOverlay, 'click', this.toggleVideoPlay);
    on(videoOverlay, 'keydown', e => {
      const spaceKey = e.key === KEY_CODES.SPACE || e.key === KEY_CODES.SPACE_IE11;
      const enterKey = e.key === KEY_CODES.ENTER;
      if (spaceKey || enterKey) {
        e.preventDefault(); // prevent page from scrolling down
        this.toggleVideoPlay(e);
      }
    });

    // Add a button to visually indicate play/pause state
    const videoButton = document.createElement('button');
    videoButton.classList.add(TARGET_CLASSES.videoButton);
    videoButton.setAttribute('tabindex', '-1');
    videoButton.setAttribute('aria-label', VIDEO_LABELS.ariaPause);
    videoButton.textContent = VIDEO_LABELS.pause;

    // Append the button to the video overlay
    videoOverlay.append(videoButton);

    return videoOverlay;
  }

  /**
   * Toggles video play/pause state
   *
   * @param {MouseEvent|KeyboardEvent} e The event from the click or keydown event listeners
   * @returns void
   */
  toggleVideoPlay(e) {
    const videoOverlay = e.currentTarget;
    // Get the <video> element associated with this video overlay
    const video = videoOverlay.parentNode.querySelector('video');
    // Get the button associated with this video overlay
    const videoButton = videoOverlay.querySelector(`.${TARGET_CLASSES.videoButton}`);

    if (!video) {
      return;
    }

    // Toggle play/pause
    if (video.paused) {
      video.play();
      videoButton.textContent = VIDEO_LABELS.pause;
      videoButton.setAttribute('aria-label', VIDEO_LABELS.ariaPause);
      videoOverlay.setAttribute('aria-label', VIDEO_LABELS.ariaPause);
    } else {
      video.pause();
      videoButton.textContent = VIDEO_LABELS.play;
      videoButton.setAttribute('aria-label', VIDEO_LABELS.ariaPlay);
      videoOverlay.setAttribute('aria-label', VIDEO_LABELS.ariaPlay);
    }
  }
}

export default Slide;
