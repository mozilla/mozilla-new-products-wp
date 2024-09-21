/**
 * Applies the event listener to the given element(s).
 *
 * @example
 * ```js
 * // Creates an event listener on window scroll
 * const off = on(window, 'scroll', onScroll);
 * // Returns function to remove event listener when you're done
 * off();
 * ```
 *
 * @example
 * ```js
 * // Handles one or multiple elements
 * const off = on([input, input2, input3], 'blur', onBlur);
 * ```
 *
 * @param {HTMLElement|HTMLElement[]} elementOrMultiple one or many HTML elements to apply the listener to
 * @param {string} type the type of event to apply
 * @param {Function} listener the event listener callback
 * @param {boolean|EventListenerOptions} options the event listener options to use
 * @returns {Function} a function that unsubscribes from any event listeners
 */
const on = (elementOrMultiple, type, listener, options) => {
  /**
   * @type {HTMLElement[]} the elements to attach listeners to
   */
  let elements = elementOrMultiple;
  if (!Array.isArray(elementOrMultiple)) {
    elements = [elementOrMultiple];
  }

  elements.forEach(el => {
    if (el) {
      el.addEventListener(type, listener, options);
    }
  });

  return () => {
    elements.forEach(el => {
      if (el) {
        el.removeEventListener(type, listener, options);
      }
    });
  };
};

export default on;
