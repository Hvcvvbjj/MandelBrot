const path = require('path');

module.exports = [
  {
    entry: './Script.js',
    output: {
      filename: 'Script.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true
    },
    mode: 'production'
  },
  {
    entry: './MandelbrotWorker.js',
    output: {
      filename: 'MandelbrotWorker.js',
      path: path.resolve(__dirname, 'dist')
    },
    target: 'webworker',
    mode: 'production'
  }
];
