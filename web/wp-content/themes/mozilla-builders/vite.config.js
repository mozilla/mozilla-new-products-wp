import path from 'path';
import { defineConfig } from 'vite';

const BASE_PATH = '/wp-content/themes/mozilla-builders';
function base(mode) {
  if (mode === 'production') {
    return `${BASE_PATH}/dist`;
  } else {
    return BASE_PATH;
  }
}

export default defineConfig(env => ({
  base: base(env.mode),
  build: {
    manifest: true,
    rollupOptions: {
      input: {
        css: path.resolve(__dirname, 'static/scss/app.scss'),
        app: path.resolve(__dirname, 'static/js/app.js'),
        admin: path.resolve(__dirname, 'static/js/admin.js'),
      },
    },
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'static/js'),
    },
  },
}));
