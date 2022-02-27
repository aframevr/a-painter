const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname,
    filename: 'build.js'
  },
  module: {},
  optimization: {
    minimizer: [new TerserPlugin({
      extractComments: false
    })]
  },
  devServer: {
    historyApiFallback: true,
    allowedHosts: "all",
    static: {
      directory: __dirname,
      publicPath: '/'
    }
  }
};
