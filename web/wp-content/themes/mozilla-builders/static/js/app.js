/* eslint-disable */
import LazySizes from 'lazysizes';
import Unveilhooks from 'lazysizes/plugins/unveilhooks/ls.unveilhooks';
/* eslint-enable */

import { onDocumentReady } from '@src/utils';

// Components
import Menu from '@src/components/menu';
import Links from '@src/components/links';

onDocumentReady(() => {
  new Links();

  const MENU_CLASS = '.js--menu';
  if (document.querySelector(MENU_CLASS)) {
    new Menu(MENU_CLASS);
  }

  if (process.env.NODE_ENV === 'development') {
    import(/* webpackChunkName: "toggle-grid" */ '@src/components/toggle-grid').then(module => {
      const ToggleGrid = module.default;
      new ToggleGrid();
    });
  }

  if (document.querySelector('.js-modal-gallery')) {
    import(/* webpackChunkName: "modal-gallery" */ '@src/components/modal-gallery').then(module => {
      const ModalGallery = module.default;
      new ModalGallery();
    });
  }

  if (document.querySelector('.js-hang-punc')) {
    import(/* webpackChunkName: "hang-punctuation" */ '@src/components/hang-punctuation').then(
      module => {
        const HangPunctuation = module.default;
        new HangPunctuation();
      },
    );
  }

  // This is an example of how to do code splitting. The JS in this
  // referenced file will only be loaded on that page. Good for
  // when you have a large amount of JS only needed in one place
  //
  //  if (document.querySelector('#js-process')) {
  //    import(/* webpackChunkName: "process" */ './pages/process')
  //      .then(module => {
  //        const Process = module.default;
  //        this.process = new Process();
  //      });
  //  }
});
