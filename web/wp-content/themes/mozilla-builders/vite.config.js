import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
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
});
