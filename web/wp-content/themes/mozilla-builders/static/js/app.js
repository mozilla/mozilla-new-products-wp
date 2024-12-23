/* eslint-disable */
import LazySizes from 'lazysizes';
import Unveilhooks from 'lazysizes/plugins/unveilhooks/ls.unveilhooks';
/* eslint-enable */

import '../scss/app.scss';

import Alpine from 'alpinejs';
import focus from '@alpinejs/focus';
import { accelerator } from '@src/plugins/accelerator';
import { accordion } from '@src/plugins/accordion';
import { clipboard } from '@src/plugins/clipboard';
import { hangPunctuation } from '@src/plugins/hang-punctuation';
import { headingNav } from '@src/plugins/heading-nav';
import { links } from '@src/plugins/links';
import { marquee } from '@src/plugins/marquee';
import { masonry } from '@src/plugins/masonry';
import { tabs } from '@src/plugins/tabs';

// Initialize Alpine
window.Alpine = Alpine;
// Register Alpine plugins
Alpine.plugin(accelerator);
Alpine.plugin(accordion);
Alpine.plugin(clipboard);
Alpine.plugin(focus);
Alpine.plugin(hangPunctuation);
Alpine.plugin(headingNav);
Alpine.plugin(links);
Alpine.plugin(marquee);
Alpine.plugin(masonry);
Alpine.plugin(tabs);
// Start Alpine
Alpine.start();
