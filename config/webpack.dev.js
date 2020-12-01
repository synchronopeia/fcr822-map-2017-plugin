/* eslint-disable import/no-extraneous-dependencies */

const webpack = require('webpack');
const { merge } = require('webpack-merge');
const Configstore = require('configstore');

const common = require('./webpack.common.js');
const paths = require('./paths');

const config = new Configstore('synchronopeia');

// dev server constants
const DEV_SERVER_PORT = config.get('DEV_SERVER_PORT') || 8080;
const DEV_SERVER_CHROME_CONFIG_PATH = config.get('DEV_SERVER_CHROME_CONFIG_PATH');

// CONFIG constants passed to bundle
const API_URI = config.get('API_URI') || `http://localhost:${DEV_SERVER_PORT}/assets/json`;
const MAPBOX_ACCESS_TOKEN = config.get('MAPBOX_ACCESS_TOKEN') || ''; // put your access token here if you are not using configstore

if (!MAPBOX_ACCESS_TOKEN) {
  console.log('The constant MAPBOX_ACCESS_TOKEN has not been set. Set it using configstore or use a string literal.');
  process.exit(1);
}

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    contentBase: paths.build,
    open: (DEV_SERVER_CHROME_CONFIG_PATH)
      ? {
        app: ['google-chrome', `--user-data-dir=${DEV_SERVER_CHROME_CONFIG_PATH}`, `--app=http://localhost:${DEV_SERVER_PORT}/`, '--new-window'],
      }
      : true,
    compress: true,
    hot: true,
    port: DEV_SERVER_PORT,
  },

  plugins: [
    // Only update what has changed on hot reload
    new webpack.HotModuleReplacementPlugin(),
    // Make CONFIG global constant available to bundle
    new webpack.DefinePlugin({
      CONFIG: JSON.stringify({
        MAPBOX_ACCESS_TOKEN,
        API_URI,
      }),
    }),
  ],
});
