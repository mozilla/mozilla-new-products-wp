import path from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';

const BASE_PATH = '/wp-content/themes/mozilla-new-products';
function base(mode) {
  if (mode === 'production') {
    return `${BASE_PATH}/dist`;
  }
  return BASE_PATH;
}

// Prints the hosted port to a tmp file so that PHP can read it.
function printPortPlugin() {
  const tmpPath = path.resolve(__dirname, '.vite/tmp');
  const portPath = path.resolve(tmpPath, 'port');
  return {
    name: 'print-port',
    configureServer(server) {
      server.httpServer.once('listening', () => {
        const port = server.config.server.port;
        fs.mkdirSync(tmpPath, { recursive: true });
        fs.writeFileSync(portPath, port.toString());
      });
    },
  };
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
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
      },
    },
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'static/js'),
    },
  },
  plugins: [printPortPlugin()],
}));
