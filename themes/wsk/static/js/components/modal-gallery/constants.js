export const STATE = {
  unmounted: 'unmounted',
  beforeUnmount: 'beforeUnmount',
  beforeMount: 'beforeMount',
  mounted: 'mounted',
  open: 'open',
  beforeOpen: 'beforeOpen',
  beforeClose: 'beforeClose',
};

export const TARGET_CLASSES = {
  container: 'js-modal-gallery',
  root: 'js-modal-gallery__root',
  trigger: 'js-modal-gallery__trigger',
  hidden: 'js-modal-gallery__hidden', // Add this class to any element you do not want to be visible in the modal gallery
  videoOverlay: 'js-modal-gallery__video-overlay',
  videoButton: 'js-modal-gallery__video-button',
  open: 'js-modal-gallery__open',
  caption: 'js-modal-gallery__caption',
  close: 'js-modal-gallery__close',
  countCurrent: 'js-modal-gallery__count--current',
  countTotal: 'js-modal-gallery__count--total',
  credit: 'js-modal-gallery__credit',
  next: 'js-modal-gallery__next',
  previous: 'js-modal-gallery__previous',
  slideAsset: 'js-modal-gallery__asset',
  slideActive: 'js-modal-gallery__slide--active',
  slideNext: 'js-modal-gallery__slide--next',
  slidePrevious: 'js-modal-gallery__slide--previous',
};

export const COMPONENTS = {
  caption: null,
  close: [],
  countCurrent: null,
  countTotal: null,
  credit: null,
  next: [],
  open: [],
  previous: [],
  slideActive: null,
  slideNext: null,
  slidePrevious: null,
};
