/** @type {Record<string, [string, string]>} */
const PUNCTUATION_MARKS = {
  '\u201c': ['hang-punc-medium', 'hang-punc-header-medium'], // “ - ldquo - left smart double quote
  '\u2018': ['hang-punc-small', 'hang-punc-header-small'], // ‘ - lsquo - left smart single quote
  '\u0022': ['hang-punc-medium', 'hang-punc-header-medium'], // " - ldquo - left dumb double quote
  '\u0027': ['hang-punc-small', 'hang-punc-header-small'], // ' - lsquo - left dumb single quote
  '\u00AB': ['hang-punc-large', 'hang-punc-header-large'], // « - laquo - left double angle quote
  '\u2039': ['hang-punc-medium', 'hang-punc-header-medium'], // ‹ - lsaquo - left single angle quote
  '\u201E': ['hang-punc-medium', 'hang-punc-header-medium'], // „ - bdquo - left smart double low quote
  '\u201A': ['hang-punc-small', 'hang-punc-header-small'], // ‚ - sbquo - left smart single low quote
};

/** @type {import('alpinejs').PluginCallback} */
export function hangPunctuation(Alpine) {
  Alpine.directive('hang-punc', registerRoot);
}

/**
 * Hangs the punctuation of the given element if eligible.
 *
 * @param {HTMLElement} el
 */
function hangIfEligible(el) {
  const text = el.innerText || el.textContent;

  const marks = Object.keys(PUNCTUATION_MARKS);
  marks.forEach(mark => {
    if (text.indexOf(mark) === 0) {
      const isHeader =
        el.tagName === 'H1' ||
        el.tagName === 'H2' ||
        el.tagName === 'H3' ||
        el.tagName === 'H4' ||
        el.tagName === 'H5';

      const [bodyClass, headerClass] = PUNCTUATION_MARKS[mark];
      if (isHeader) {
        el.classList.add(headerClass);
      } else {
        el.classList.add(bodyClass);
      }
    }
  });
}

/**
 * Registers the root element.
 *
 * @param {HTMLElement} el
 */
function registerRoot(el) {
  const children = el.childNodes;

  // Loop over all direct descendants of the $container
  // If it's a blockquote, loop over its direct descendants
  for (let i = 0; i < children.length; i += 1) {
    const child = children[i];

    if (child.tagName === 'blockquote') {
      for (let k = 0; k < child.childNodes.length; k += 1) {
        hangIfEligible(child.childNodes[k]);
      }
    } else {
      hangIfEligible(child);
    }
  }
}
