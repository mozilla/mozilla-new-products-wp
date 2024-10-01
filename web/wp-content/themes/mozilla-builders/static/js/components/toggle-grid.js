/**
 * ToggleGrid
 * Note: For development and design purposes
 *
 * Toggle the screen grid on and off with the 0 key
 */
class ToggleGrid {
  constructor() {
    this.initialize();
  }

  initialize() {
    document.onkeydown = e => {
      // Press 0 to toggle the grid
      if (e.key === '0') {
        document.body.classList.toggle('show-grid');
      }
    };
  }
}

export default ToggleGrid;
