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
  clearScreen: false,
  build: {
    manifest: true,
    rollupOptions: {
      input: {
        app: path.resolve(__dirname, 'static/js/app.js'),
        app_css: path.resolve(__dirname, 'static/scss/app.scss'),
        admin: path.resolve(__dirname, 'static/js/admin.js'),
        admin_css: path.resolve(__dirname, 'static/scss/admin.scss'),
      },
    },
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'static/js'),
    },
  },
}));
