import Splide from '@splidejs/splide';

export function imageCarousel(Alpine) {
  Alpine.directive('image-carousel', el => {
    Alpine.bind(el, {
      'x-init'() {
        new Splide(el, {
          type: 'fade',
          autoWidth: true,
          pagination: false,
          rewind: true,
        }).mount();
      },
    });
  });
}
