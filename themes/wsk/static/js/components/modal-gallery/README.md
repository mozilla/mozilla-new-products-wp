# Modal Gallery

> A component to automatically create a gallery of media content

The modal gallery component automatically creates a gallery of media content from a certain part of the page. This makes it really simple to create a slideshow with close to no setup!

## Table of Contents

- [Setup](#setup)
- [HTML API](#html-api)
- [JS API](#js-api)

## Setup

There are three parts to set up:

1. Add the `js-modal-gallery` class to the root component to search for `img` and `video` components:

   ```html
   <div class="js-modal-gallery">
     <img
       src="/static/1.png"
       alt="The first image"
       data-caption="The first image"
       data-credit="By Mike Burns" />
     <p>
       Nulla vitae elit libero, a pharetra augue. Aenean eu leo quam. Pellentesque ornare sem
       lacinia quam venenatis vestibulum.
     </p>
     <img
       src="/static/2.png"
       alt="The second image"
       data-caption="The second image"
       data-credit="By Nathan Haas" />
     <p>
       Cras mattis consectetur purus sit amet fermentum. Donec sed odio dui. Aenean eu leo quam.
       Pellentesque ornare sem lacinia quam venenatis vestibulum.
     </p>
     <video
       autoplay
       loop
       poster="/static/3.png"
       data-caption="The best video"
       data-credit="By Brittany Chiang">
       <source src="/static/3.mp4" type="video/mp4" />
     </video>
   </div>
   ```

2. Add the `js-modal-gallery__root` class to the root component for the modal mount point. Add any components you'd like as well.

   ```html
   <div class="js-modal-gallery">
     <!-- content -->
   </div>
   <div class="js-modal-gallery__root">
     <button class="js-modal-gallery__close">Close</button>

     <button class="js-modal-gallery__previous">Previous</button>
     <button class="js-modal-gallery__next">Next</button>

     <div>
       <div class="js-modal-gallery__slide--previous"></div>
       <div class="js-modal-gallery__slide--active"></div>
       <div class="js-modal-gallery__slide--next"></div>
     </div>

     <div>Slide #<span class="js-modal-gallery__count--current"></span></div>
     <div>
       <span class="js-modal-gallery__caption"></span>
       <span class="js-modal-gallery__credit"></span>
     </div>
   </div>
   ```

3. Add the `js-modal-gallery__hidden` class to any element that you do not want included in the modal gallery.

4. Include the modal gallery component in your `app.js`

   ```js
   import ModalGallery from '@src/components/modal-gallery';

   onDocumentReady(() => {
     new ModalGallery();
   });
   ```

## HTML API

### Container

`js-modal-gallery`

The container is where all gallery images and videos are sourced from.

_Allows multiple?_ ❌

#### Available components

**Open button** | `js-modal-gallery__open`

Applies a listener to open the modal on click. An optional `data-slide` attribute sets which slide to open to

_Allows multiple?_ ✅

```html
<button class="js-modal-gallery__open">Open gallery</button>

<button class="js-modal-gallery__open" data-slide="3">Open gallery to slide 3</button>
```

### Root

`js-modal-gallery__root`

The mount point for the modal

_Allows multiple?_ ❌

#### Available components

**Close button** | `js-modal-gallery__close`

Applies a listener to close the modal on click.

_Allows multiple?_ ✅

```html
<button class="js-modal-gallery__close">Close gallery</button>
```

**Next button** | `js-modal-gallery__next`

Applies a listener to advance the slide on click.

_Allows multiple?_ ✅

```html
<button class="js-modal-gallery__next">Next slide</button>
```

**Previous button** | `js-modal-gallery__previous`

Applies a listener to go back to the previous slide on click.

_Allows multiple?_ ✅

```html
<button class="js-modal-gallery__previous">Previous slide</button>
```

**Slide count (current)** | `js-modal-gallery__count--current`

Appends the current slide number to the element.

_Allows multiple?_ ❌

```html
<span class="js-modal-gallery__count--current"></span>
```

**Slide count (total)** | `js-modal-gallery__count--total`

Appends the total number of slides in the gallery to the element.

_Allows multiple?_ ❌

```html
<span class="js-modal-gallery__count--total"></span>
```

**Caption** | `js-modal-gallery__caption`

Appends the current slide's caption to the element. This is set via the `data-caption` attribute on source images and videos.

_Allows multiple?_ ❌

```html
<!-- in js-modal-gallery -->
<img src="/static/1.png" data-caption="This is the caption" />

<!-- in js-modal-gallery__root -->
<span class="js-modal-gallery__caption"></span>
```

**Credit** | `js-modal-gallery__credit`

Appends the current slide's credit to the element. This is set via the `data-credit` attribute on source images and videos.

_Allows multiple?_ ❌

```html
<!-- in js-modal-gallery -->
<img src="/static/1.png" data-credit="This is the credit" />

<!-- in js-modal-gallery__root -->
<span class="js-modal-gallery__credit"></span>
```

**Slide (active)** | `js-modal-gallery__slide--active`

Appends the current slide to the element.

_Allows multiple?_ ❌

```html
<div class="js-modal-gallery__slide--active"></div>
```

**Slide (previous)** | `js-modal-gallery__slide--previous`

Appends the previous slide to the element.

_Allows multiple?_ ❌

```html
<div class="js-modal-gallery__slide--previous"></div>
```

**Slide (next)** | `js-modal-gallery__slide--next`

Appends the next slide to the element.

_Allows multiple?_ ❌

```html
<div class="js-modal-gallery__slide--next"></div>
```

## JS API

### Constructor

Creates a new Modal Gallery and mounts it.

```js
const gallery = new ModalGallery();
```

### `.mount()`

Mounts an unmounted gallery. Throws an error if already mounted.

```js
gallery.mount();
```

### `.unmount()`

Unmounts a mounted gallery. Closes the modal if open.

```js
gallery.unmount();
```

### `.open()`

Opens the modal gallery.

| Argument | Type     | Optional | Description                       |
| -------- | -------- | -------- | --------------------------------- |
| `index`  | `number` | ✅       | The index of the slide to open to |

```js
gallery.open(); // Opens to the first slide
gallery.open(0); // Opens to the first slide
gallery.open(3); // Opens to the fourth slide
```

### `.close()`

Closes an open modal gallery.

```js
gallery.close();
```

### `.next()`

Advances to the next slide.

```js
gallery.next();
```

### `.previous()`

Goes back to the previous slide.

```js
gallery.previous();
```

### `.goToSlide()`

Goes to the slide at the given index.

| Argument | Type     | Optional | Description                          |
| -------- | -------- | -------- | ------------------------------------ |
| `index`  | `number` |          | The index of the slide to advance to |

```js
gallery.goToSlide(0); // Goes to the first slide
gallery.goToSlide(3); // Goes to the fourth slide
```

### `.index`

The current slide index.

```js
gallery.index; // 3
```

### `.numSlides`

The current number of slides in the gallery.

```js
gallery.numSlides; // 15
```
