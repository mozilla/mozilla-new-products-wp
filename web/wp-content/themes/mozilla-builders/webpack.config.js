const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = () => ({
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

  // NOTE: Scripts for blocks are compiled separately using wp-scripts in package.json

  entry: {
    app: [
      'core-js/stable',
      'regenerator-runtime/runtime',
      path.resolve(__dirname, 'static/js/app.js'),
      path.resolve(__dirname, 'static/scss/app.scss'),
    ],
    admin: [
      path.resolve(__dirname, 'static/js/admin.js'),
      path.resolve(__dirname, 'static/scss/admin.scss'),
    ],
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/static'),
    publicPath: '/wp-content/themes/mozilla-builders/dist/static/',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'img',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts',
        },
      },
    ],
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },

  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'static/js'),
    },
  },

  plugins: [
    // https://www.npmjs.com/package/dotenv-webpack
    new Dotenv(),
    // https://www.npmjs.com/package/browser-sync-webpack-plugin
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      proxy: 'https://mozilla-builders-wp.ddev.site',
      files: ['*.php', 'templates/**/*.twig'],
      open: false,
      ghostMode: false,
      notify: false,
    }),
    // https://www.npmjs.com/package/mini-css-extract-plugin
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'static/fonts',
          to: 'fonts',
        },
      ],
    }),
  ],

  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'inline-source-map',
});
