"use strict";

var path = require('path');

module.exports = {
  // Define your entry point (your main app file)
  entry: './src/index.js',
  // adjust this to your actual entry file
  // Define output settings (where your bundled files will go)
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  // Fallback polyfills for Node.js modules
  resolve: {
    fallback: {
      "buffer": require.resolve("buffer/"),
      "timers": require.resolve("timers-browserify")
    }
  },
  // Add your module rules or loaders if necessary
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader' // Adjust if you're using Babel or another loader

      }
    }]
  } // Any additional settings you need...

};