var webpack = require('webpack');

var PLUGINS = [];
if (process.env.NODE_ENV === 'production') {
  new webpack.optimize.UglifyJsPlugin()
}

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname,
    filename: 'build.js'
  },
  plugins: PLUGINS
};
