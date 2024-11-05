const LARGE_SCREEN_BREAKPOINT = 767;

class MasonryGrid {
  constructor(root) {
    this.root = root;
    this.rowHeight = 10;
    this.rowGap = parseInt(window.getComputedStyle(this.root).getPropertyValue('grid-row-gap'));
    this.setup();
  }

  setup() {
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
  }

  resize() {
    if (window.innerWidth > LARGE_SCREEN_BREAKPOINT) {
      this.root.style.gridAutoRows = `${this.rowHeight}px`;
      Array.from(this.root.children).forEach(this.resizeGridItem.bind(this));
    }
  }

  resizeGridItem(item) {
    const itemContent = item.children[0];

    if (!itemContent) {
      return;
    }

    const { height } = itemContent.getBoundingClientRect();
    const rowSpan = Math.ceil((height + this.rowGap) / (this.rowHeight + this.rowGap));
    item.style.gridRowEnd = `span ${rowSpan}`;
  }
}

export default MasonryGrid;
