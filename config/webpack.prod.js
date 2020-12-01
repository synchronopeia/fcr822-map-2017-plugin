/* eslint-disable import/no-extraneous-dependencies */

const webpack = require('webpack');
const { merge } = require('webpack-merge');
const Configstore = require('configstore');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const common = require('./webpack.common.js');
const paths = require('./paths');

const config = new Configstore('synchronopeia');

// CONFIG constants passed to bundle
const API_URI = config.get('API_URI'); // TODO: differentiate between dev and prod
const MAPBOX_ACCESS_TOKEN = config.get('MAPBOX_ACCESS_TOKEN') || ''; // put your access token here if you are not using configstore

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  output: {
    path: paths.build,
    publicPath: '/',
    filename: 'js/[name].[contenthash].bundle.js',
  },
  plugins: [
    // Extracts CSS into separate files
    // Note: style-loader is for development, MiniCssExtractPlugin is for production
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash].css',
      chunkFilename: '[id].css',
    }),
    // Make CONFIG global constant available to bundle
    new webpack.DefinePlugin({
      CONFIG: JSON.stringify({
        MAPBOX_ACCESS_TOKEN,
        API_URI,
      }),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: false,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin(), '...'],
    // Once your build outputs multiple chunks, this option will ensure they share the webpack runtime
    // instead of having their own. This also helps with long-term caching, since the chunks will only
    // change when actual code changes, not the webpack runtime.
    runtimeChunk: {
      name: 'runtime',
    },
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
});
