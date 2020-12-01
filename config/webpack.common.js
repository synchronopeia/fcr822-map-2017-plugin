/* eslint-disable import/no-extraneous-dependencies */

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const paths = require('./paths');

module.exports = {
  entry: [`${paths.src}/index.js`],
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    path: paths.build,
    filename: '[name].bundle.js',
    publicPath: '/',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.public,
          to: 'assets',
          globOptions: {
            ignore: ['*.DS_Store'],
          },
        },
      ],
    }),
    new HtmlWebpackPlugin({
      title: 'FCR 822 Plugin',
      favicon: `${paths.src}/images/favicon.png`,
      template: `${paths.src}/template.html`, // template file
      filename: 'index.html', // output file
    }),
  ],
  module: {
    rules: [
      // Use Babel to transpile JavaScript files
      { test: /\.js(x?)$/, exclude: /node_modules/, use: ['babel-loader'] },
      // Inject CSS into the head with source maps
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },

      // Copy image files to build folder
      { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource' },

      // Inline files
      { test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: 'asset/inline' },
    ],
  },
};
