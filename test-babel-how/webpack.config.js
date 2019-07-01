const path = require('path')

module.exports = {
  entry: './src/code.js',
  output: {
    path: path.resolve(__dirname, 'dist2'),
    filename: 'code.bundle.js',
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader'}
    ],
  },
  optimization: { minimizer: [] },
}