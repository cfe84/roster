const path = require('path');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

module.exports = {
  entry: './src/app.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.bundle.js',
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader' },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  mode: "development",
  plugins: [
    new MomentLocalesPlugin(),
    new MomentLocalesPlugin({ localesToKeep: ['en'] }),
  ],
  node: { fs: "empty" }
};