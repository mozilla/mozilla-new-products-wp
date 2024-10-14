import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { on, StateMachine } from '@src/utils';
import { KEY_CODES } from '@src/utils/constants';
import Slide from './Slide';
import { STATE, TARGET_CLASSES, COMPONENTS } from './constants';

/**
 * ModalGallery
 *
 * Gathers the images and other media from a page and displays them in a modal gallery.
 *
 */
class ModalGallery {
  /**
   * Creates a new modal gallery instance and mounts it.
   */
  constructor() {
    this._index = 0;
    this.stateManager = new StateMachine(STATE.unmounted, {
      [STATE.unmounted]: [STATE.beforeMount],
      [STATE.beforeMount]: [STATE.mounted],
      [STATE.mounted]: [STATE.beforeOpen, STATE.beforeUnmount],
      [STATE.beforeOpen]: [STATE.open],
      [STATE.open]: [STATE.beforeClose],
      [STATE.beforeClose]: [STATE.mounted],
      [STATE.beforeUnmount]: [STATE.unmounted],
    });

    this.container = this._getComponent(TARGET_CLASSES.container, { rootEl: document });
    this.root = null;
    this.modalOpener = null;

    /**
     * @type {Record<keyof COMPONENTS, HTMLElement>}
     */
    this.components = Object.assign({}, COMPONENTS);

    /**
     * @type {Slide[]} all slides for the modal gallery
     */
    this.slides = [];

    /**
     * @type {Function[]} event listeners for when the gallery is mounted
     */
    this.listeners = [];

    /**
     * @type {Function[]} event listeners for when the gallery is open
     */
    this.galleryListeners = [];

    this.mount();
  }

  /**
   * @type {HTMLElement[]} all focusable elements within the modal gallery
   */
  get focusableElements() {
    if (this.stateManager.state !== STATE.open) {
      return [];
    }
    const focusables = ['button', '[href]', 'video', '[tabindex]:not([tabindex="-1"])'];
    const focusableQuery = focusables.join(', ');
    return Array.from(this.root.querySelectorAll(focusableQuery));
  }

  /**
   * @type {number} the current gallery index
   */
  get index() {
    return this._index;
  }

  /**
   * Updates the current index, automatically bounding it to the maximum number of
   * slides available.
   *
   * @param {number} newIndex the new index to set to
   */
  set index(newIndex) {
    this._index = this._getBoundedIndex(newIndex);
  }

  /**
   * @type {boolean} whether the component is currently mounted
   */
  get isMounted() {
    return this.stateManager.isStateOneOf([
      STATE.beforeMount,
      STATE.mounted,
      STATE.beforeOpen,
      STATE.open,
      STATE.beforeClose,
      STATE.beforeUnmount,
    ]);
  }

  /**
   * @type {string} the number of slides in the gallery
   */
  get numSlides() {
    return this.slides.length;
  }

  /**
   * Callback for when the gallery is about to be mounted. Initializes all slides and components.
   * Use the `js-modal-gallery__hidden` class to hide any elements you do not want to be visible in the modal gallery.
   */
  _beforeMount() {
    // Hide the root
    this.root.setAttribute('aria-hidden', true);

    // Initalizes all slides and attaches listeners
    const mediaQuery = ['img', 'video']
      .map(tag => `${tag}:not(.${TARGET_CLASSES.hidden}):not(.wp-rich-text-inline-image)`)
      .join(', ');
    const media = Array.from(this.container.querySelectorAll(mediaQuery));
    this.slides = media.map((mediaItem, index) => {
      const slide = new Slide(mediaItem);
      const openBtn = slide.getOrCreateOpenButton();

      this.listeners.push(
        on(openBtn, 'click', () => {
          this.open(index);
        }),
      );
      return slide;
    });

    // Add click listeners for manually declared open buttons in the container
    this.components.open = this._getComponent(TARGET_CLASSES.open, {
      rootEl: this.container,
      multiple: true,
    });
    this.listeners.push(
      on(this.components.open, 'click', evt => {
        const slideNum = parseInt(evt.target.dataset.slide, 10) || 1;
        const index = slideNum - 1;
        this.open(index);
      }),
    );

    // Fetch all optional root components
    this.components.caption = this._getComponent(TARGET_CLASSES.caption);
    this.components.close = this._getComponent(TARGET_CLASSES.close, { multiple: true });
    this.components.countCurrent = this._getComponent(TARGET_CLASSES.countCurrent);
    this.components.countTotal = this._getComponent(TARGET_CLASSES.countTotal);
    this.components.credit = this._getComponent(TARGET_CLASSES.credit);
    this.components.next = this._getComponent(TARGET_CLASSES.next, { multiple: true });
    this.components.previous = this._getComponent(TARGET_CLASSES.previous, { multiple: true });
    this.components.slideActive = this._getComponent(TARGET_CLASSES.slideActive);
    this.components.slideNext = this._getComponent(TARGET_CLASSES.slideNext);
    this.components.slidePrevious = this._getComponent(TARGET_CLASSES.slidePrevious);

    // Sets content for slide total

    if (this.numSlides > 1) {
      this._setInnerHTML(this.components.countTotal, this.numSlides);
    } else {
      this.root.classList.add('disable-controls');
    }
  }

  /**
   * Mounts the modal gallery. If the gallery was already mounted, an error will be thrown!
   */
  mount() {
    if (this.isMounted) {
      throw new Error('Modal gallery has already been mounted!');
    }

    this.root = this._getComponent(TARGET_CLASSES.root, { rootEl: document });

    if (process.env.NODE_ENV === 'development' && !this.root) {
      console.warn('No mount point for the modal gallery!');
    } else {
      this.stateManager.setState(STATE.beforeMount);
      this._beforeMount();
      this.stateManager.setState(STATE.mounted);
    }
  }

  /**
   * Callback for when the gallery is about to be unmounted. Removes all event listeners,
   * slides, and any edited content. Resets the gallery.
   */
  _beforeUnmount() {
    // Remove listeners
    this.listeners.forEach(off => {
      off();
    });
    this.listeners = [];

    // Remove slides
    this.slides.forEach(slide => {
      slide.unmount();
    });
    this.slides = [];

    // Unmounts media from slide components
    this._removeChildren(this.components.slideActive);
    this._removeChildren(this.components.slideNext);
    this._removeChildren(this.components.slidePrevious);

    // Removes any added text
    this._setInnerHTML(this.components.caption, '');
    this._setInnerHTML(this.components.credit, '');
    this._setInnerHTML(this.components.countCurrent, '');
    this._setInnerHTML(this.components.countTotal, '');

    this.root = null;
    this.components = Object.assign({}, COMPONENTS);
    this.index = 0;
  }

  /**
   * Unmounts the modal gallery component.
   */
  unmount() {
    if (this.stateManager.state === STATE.mounted || this.stateManager.state === STATE.open) {
      if (this.stateManager.state === STATE.open) {
        this.close();
      }
      this.stateManager.setState(STATE.beforeUnmount);
      this._beforeUnmount();
      this.stateManager.setState(STATE.unmounted);
    }
  }

  /**
   * Gets the next index, bounded by the maximum number of slides.
   *
   * @param {number} index the index to bound
   * @return {number} the bounded index
   */
  _getBoundedIndex(index) {
    return Math.min(this.numSlides, Math.max(0, (index + this.numSlides) % this.numSlides));
  }

  /**
   * Queries for a component using the target class.
   *
   * @param {string}      targetClass        the class to target (without "." prefix)
   * @param {Object}      [options={}]
   * @param {HTMLElement} [options.rootEl]   the element to query from (defaults to root component)
   * @param {boolean}     [options.multiple] whether to query for multiple or only the first
   * @return {HTMLElement} the queried element, or `undefined` if not found
   */
  _getComponent(targetClass, options = {}) {
    const selector = `.${targetClass}`;
    const root = options.rootEl || this.root;
    if (options.multiple) {
      return Array.from(root.querySelectorAll(selector));
    }
    return root.querySelector(selector);
  }

  /**
   * Handles forcing the tab focus to only focusable elements within the modal gallery. If
   * no item within the modal is currently focused, the first element will receive focus.
   *
   * @param {KeyboardEvent} evt the keydown event
   */
  _handleTab(evt) {
    const focusableElements = this.focusableElements;
    const activeElement = this.modalElement.ownerDocument.activeElement;

    if (focusableElements.length <= 1) {
      evt.preventDefault();
      return;
    }

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (this.root === activeElement || !this.root.contains(activeElement)) {
      evt.preventDefault();
      first.focus();
    } else if (evt.shiftKey && activeElement === first) {
      evt.preventDefault();
      last.focus();
    } else if (!evt.shiftKey && activeElement === last) {
      evt.preventDefault();
      first.focus();
    }
  }

  /**
   * Handles all key events when the modal gallery is open, including changing
   * slides, closing the modal, and forcing tab focus.
   *
   * @param {KeyboardEvent} evt the keydown event
   */
  _onKeyDown(evt) {
    switch (evt.key) {
      case KEY_CODES.ARROW_LEFT:
      case KEY_CODES.ARROW_LEFT_IE11: {
        this.previous();
        break;
      }

      case KEY_CODES.ARROW_RIGHT:
      case KEY_CODES.ARROW_RIGHT_IE11: {
        this.next();
        break;
      }

      case KEY_CODES.ESCAPE:
      case KEY_CODES.ESCAPE_IE11: {
        this.close();
        break;
      }

      case KEY_CODES.TAB: {
        this._handleTab(evt);
        break;
      }

      default: {
        break;
      }
    }
  }

  /**
   * Removes all children from a given element.
   *
   * @param {HTMLElement} element the element to remove all children from
   */
  _removeChildren(element) {
    if (element) {
      while (element.firstChild) {
        element.removeChild(element.lastChild);
      }
    }
  }

  /**
   * Sets the inner HTML property of a given element.
   *
   * @param {HTMLElement} element the element to update
   * @param {string}      html    the HTML to set
   */
  _setInnerHTML(element, html) {
    if (element) {
      element.innerHTML = html;
    }
  }

  /**
   * Updates the slides, caption, credit, and count based on the current index.
   */
  _update() {
    if (this.stateManager.state === STATE.beforeOpen || this.stateManager.state === STATE.open) {
      const currentSlide = this.slides[this.index];

      this._removeChildren(this.components.slideActive);
      currentSlide.renderTo(this.components.slideActive, true);

      this._removeChildren(this.components.slideNext);
      const nextSlide = this.slides[this._getBoundedIndex(this.index + 1)];
      nextSlide.renderTo(this.components.slideNext);

      this._removeChildren(this.components.slidePrevious);
      const previousSlide = this.slides[this._getBoundedIndex(this.index - 1)];
      previousSlide.renderTo(this.components.slidePrevious);

      this._setInnerHTML(
        this.components.caption,
        currentSlide.caption ? `<span>${currentSlide.caption}</span>` : '',
      );
      this._setInnerHTML(
        this.components.credit,
        currentSlide.credit ? `<span>${currentSlide.credit}</span>` : '',
      );
      this._setInnerHTML(this.components.countCurrent, this.index + 1);
    }
  }

  /**
   * Callback for when the modal gallery is about to open. Updates the index to the given
   * one, initializes event listeners, locks body scroll, and makes the gallery visible.
   *
   * @param {number} [index] the index to open the gallery to
   */
  _beforeOpen(index) {
    if (index !== undefined) {
      this.index = index;
    }

    this.galleryListeners.push(
      on(window, 'keydown', this._onKeyDown.bind(this)),
      on(this.components.close, 'click', this.close.bind(this)),
      on(this.components.next, 'click', this.next.bind(this)),
      on(this.components.previous, 'click', this.previous.bind(this)),
    );

    this._update();
    this.root.setAttribute('aria-hidden', false);
    this.modalOpener = this.root.ownerDocument.activeElement;
    this.root.focus();

    disableBodyScroll(this.root);
  }

  /**
   * Opens the modal gallery.
   *
   * @param {number} [index] the index to open the gallery to
   */
  open(index) {
    if (this.stateManager.state === STATE.mounted) {
      this.stateManager.setState(STATE.beforeOpen);
      this._beforeOpen(index);
      this.stateManager.setState(STATE.open);
    }
  }

  /**
   * Goes to the slide at the given index.
   *
   * @param {number} index the index to go to
   */
  goToSlide(index) {
    if (this.stateManager.state === STATE.open) {
      this.index = index;
      this._update();
    }
  }

  /**
   * Advances to the next slide.
   */
  next() {
    if (this.stateManager.state === STATE.open) {
      this.index += 1;
      this._update();
    }
  }

  /**
   * Advances to the previous slide.
   */
  previous() {
    if (this.stateManager.state === STATE.open) {
      this.index -= 1;
      this._update();
    }
  }

  /**
   * Callback for when the gallery is about to close. Removes all event listeners, unlocks
   * body scroll, and hides the gallery.
   */
  _beforeClose() {
    this.galleryListeners.forEach(off => {
      off();
    });
    this.galleryListeners = [];

    enableBodyScroll(this.root);
    this.root.setAttribute('aria-hidden', true);
    if (this.modalOpener !== document.body) {
      this.modalOpener?.focus();
      this.modalOpener = null;
    }
  }

  /**
   * Closes the modal gallery.
   */
  close() {
    if (this.stateManager.state === STATE.open) {
      this.stateManager.setState(STATE.beforeClose);
      this._beforeClose();
      this.stateManager.setState(STATE.mounted);
    }
  }
}

export default ModalGallery;
