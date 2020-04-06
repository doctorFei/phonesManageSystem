const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const common = require('./webpack.common.js');
const config = require('../config/common.js');


module.exports = merge(common, {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false
      }
    }),
    new CleanWebpackPlugin([config.projectName, 'target'], {
      root: path.resolve(__dirname, '../')
    }),
    new ZipPlugin({
      path: path.resolve(__dirname, '../target'),
      pathPrefix: config.projectName,
      filename: config.projectName
    })
  ]
});
