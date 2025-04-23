import plugin from 'tailwindcss/plugin';

export default plugin(({ addVariant }) => {
  addVariant('pointer-fine', '@media (pointer: fine)');
});
