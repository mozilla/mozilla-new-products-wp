/* eslint-disable */
import LazySizes from 'lazysizes';
import Unveilhooks from 'lazysizes/plugins/unveilhooks/ls.unveilhooks';
/* eslint-enable */

import '../scss/app.scss';

import Alpine from 'alpinejs';
import focus from '@alpinejs/focus';
import { accordion } from '@src/plugins/accordion';
import { hangPunctuation } from '@src/plugins/hang-punctuation';
import { links } from '@src/plugins/links';
import { videoEmbed } from '@src/plugins/video-embed';
import { dialog } from './plugins/dialog';

// Initialize Alpine
window.Alpine = Alpine;

// Register Alpine plugins
Alpine.plugin(accordion);
Alpine.plugin(dialog);
Alpine.plugin(focus);
Alpine.plugin(hangPunctuation);
Alpine.plugin(links);
Alpine.plugin(videoEmbed);

// Start Alpine
Alpine.start();
