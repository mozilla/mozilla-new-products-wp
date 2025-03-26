import Splide from '@splidejs/splide';
import '@splidejs/splide/css/core';

export function imageCarousel(Alpine) {
  Alpine.directive('image-carousel', el => {
    Alpine.bind(el, {
      'x-init'() {
        new Splide(el, {
          type: 'fade',
          autoWidth: true,
          pagination: false,
        }).mount();
      },
    });
  });
}
