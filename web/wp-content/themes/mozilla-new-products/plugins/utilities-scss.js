import plugin from 'tailwindcss/plugin';
import { parse } from 'postcss';
import { objectify } from 'postcss-js';
import { compile } from 'sass';

export default plugin.withOptions(
  /**
   * @param {Object} options
   * @param {string} options.filename
   */
  function (options) {
    return ({ addUtilities, addComponents, addBase }) => {
      if (!options.filename) {
        throw new Error('filename is required');
      }

      const scss = compile(options.filename);
      const root = parse(scss.css);
      const jss = objectify(root);

      if ('@layer base' in jss) {
        addBase(jss['@layer base']);
      }

      if ('@layer components' in jss) {
        addComponents(jss['@layer components']);
      }

      if ('@layer utilities' in jss) {
        addUtilities(jss['@layer utilities']);
      }
    };
  },
);
