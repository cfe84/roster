const path = require('path');

module.exports = {
  entry: './src/app.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.bundle.js'
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader' }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts']
  },
  mode: "development"
};