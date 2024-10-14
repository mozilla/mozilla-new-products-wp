import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { on } from '@src/utils';
import { KEY_CODES } from '@src/utils/constants';

/**
 * Menu
 *
 * Add behaviors to open, close, and navigate within the mobile/small screen menu
 */
class Menu {
  constructor(classname) {
    this.classname = classname;

    this.body = document.querySelector('body');
    this.logo = document.querySelector('.nav__logo-link');
    this.menu = document.querySelector(`${this.classname}`);
    this.menuToggle = document.querySelector(`${this.classname}-toggle`);
    this.menuIsOpen = false;
    // Set focusable elements
    this.focusableEls = [
      this.logo,
      this.menuToggle,
      ...Array.from(this.menu.querySelectorAll('a')),
    ];

    this.firstFocusableEl = this.focusableEls[0];
    this.lastFocusableEl = this.focusableEls[this.focusableEls.length - 1];

    this.listeners = [];

    this.bindEvents();
  }

  /**
   * Returns the classname without the starting `.`
   *
   * @example
   * this.classname = '.js--menu';
   * // this.plainClassname === 'js--menu'
   */
  get plainClassname() {
    return this.classname.replace(/^\.*/g, '');
  }

  get activeClass() {
    return `${this.plainClassname}-active`;
  }

  bindEvents() {
    this.menuToggle.addEventListener('click', () => this.toggle());
  }

  open() {
    this.menuToggle.setAttribute('aria-expanded', true);
    this.menu.setAttribute('aria-hidden', false);
    this.body.classList.add(this.activeClass);
    this.menuIsOpen = true;
    this.menu.focus();
    this.listeners.push(on(document, 'keydown', this.keydown.bind(this)));
    disableBodyScroll(this.menu);
  }

  close() {
    this.menuToggle.setAttribute('aria-expanded', false);
    this.menu.setAttribute('aria-hidden', true);
    this.body.classList.remove(this.activeClass);
    this.menuToggle.focus();
    this.menuIsOpen = false;
    this.listeners.forEach(off => {
      off();
    });
    enableBodyScroll(this.menu);
  }

  toggle() {
    if (this.menuIsOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  handleBackwardTab(e) {
    if (e.target.ownerDocument.activeElement === this.firstFocusableEl) {
      e.preventDefault();
      this.lastFocusableEl.focus();
    }
  }

  handleForwardTab(e) {
    if (e.target.ownerDocument.activeElement === this.lastFocusableEl) {
      e.preventDefault();
      this.firstFocusableEl.focus();
    }
  }

  keydown(e) {
    switch (e.key) {
      case KEY_CODES.ESCAPE:
      case KEY_CODES.ESCAPE_IE11: {
        this.close();
        break;
      }

      case KEY_CODES.TAB: {
        if (this.focusableEls.length === 1) {
          e.preventDefault();
          break;
        }
        if (e.shiftKey) {
          this.handleBackwardTab(e);
        } else {
          this.handleForwardTab(e);
        }
        break;
      }

      default: {
        break;
      }
    }
  }
}

export default Menu;
