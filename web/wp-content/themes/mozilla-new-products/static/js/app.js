/* eslint-disable */
import LazySizes from 'lazysizes';
import Unveilhooks from 'lazysizes/plugins/unveilhooks/ls.unveilhooks';
/* eslint-enable */

import MzpNewsletter from '@mozilla-protocol/core/protocol/js/newsletter';

import '../scss/app.scss';

import Alpine from 'alpinejs';
import focus from '@alpinejs/focus';
import { accordion } from '@src/plugins/accordion';
import { hangPunctuation } from '@src/plugins/hang-punctuation';
import { links } from '@src/plugins/links';
import { videoEmbed } from '@src/plugins/video-embed';
import { dialog } from '@src/plugins/dialog';
import { typewriter } from '@src/plugins/typewriter';
import { scrollPosition } from '@src/plugins/scroll-position';
import { imageCarousel } from '@src/plugins/image-carousel';

// Initialize Alpine
window.Alpine = Alpine;

// Register Alpine plugins
Alpine.plugin(accordion);
Alpine.plugin(dialog);
Alpine.plugin(focus);
Alpine.plugin(hangPunctuation);
Alpine.plugin(links);
Alpine.plugin(videoEmbed);
Alpine.plugin(typewriter);
Alpine.plugin(scrollPosition);
Alpine.plugin(imageCarousel);

// Start Alpine
Alpine.start();

if (document.getElementById('email-signup')) {
  MzpNewsletter.init();
}
