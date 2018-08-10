const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
// const alias = require('./alias');

const config = merge(base, {
  devtool: 'source-map',
  output: {
    chunkFilename: 'index/[name].[chunkhash:8].js',
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[chunkhash:8].js',
    publicPath: '/'
  },
  module: {
    rules: [{
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: ['url-loader?limit=10000&name=[name].[ext]?[hash:8]'],
      }, {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: ['url-loader?limit=10000&name=[name].[ext]?[hash:8]'],
      },
    ]
  },
  performance: {
    maxEntrypointSize: 300000,
    hints: false
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].[chunkhash:8].css'
    }),
    // // extract vendor chunks for better caching
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   minChunks: function (module) {
    //     // a module is extracted into the vendor chunk if...
    //     return (
    //       // it's inside node_modules
    //       /node_modules/.test(module.context) &&
    //       // and not a CSS file (due to extract-text-webpack-plugin limitation)
    //       !/\.css$/.test(module.request)
    //     )
    //   }
    // }),
    new FriendlyErrorsPlugin()
  ]
  // resolve: {
  //   alias: alias,
  // }
})

module.exports = config