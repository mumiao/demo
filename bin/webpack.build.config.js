const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = merge(base, {
  devtool: false,
  output: {
    chunkFilename: 'index/[name].[chunkhash:8].js',
    path: path.resolve(__dirname, '../dist'),
    filename: `[name].[chunkhash:8].js`
  },
  performance: {
    maxEntrypointSize: 300000,
    hints: 'warning'
  },
  module: {
    rules: [{
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [`url-loader?limit=10000&name=images/[name].[ext]?[hash:8]`],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [`url-loader?limit=10000&name=images/[name].[ext]?[hash:8]`],
      }
    ]
  },
  plugins: [
    // new webpack.DefinePlugin({
    //   'process.env.NODE_ENV': '"production"'
    // }),
    new ExtractTextPlugin({
      filename: `[name].[contenthash:8].css`
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false, // Suppress uglification warnings
    //     screw_ie8: true,
    //     drop_console: true,
    //     pure_funcs: ['console.log']
    //   },
    //   output: {
    //     comments: false,
    //   },
    //   exclude: [/\.min\.js$/gi],
    //   sourceMap: false,
    // }),
    new webpack.NoEmitOnErrorsPlugin(),
    // // extract vendor chunks for better caching
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'static/vendor',
    //   minChunks: function (module) {
    //     // a module is extracted into the vendor chunk if...
    //     return (
    //       // it's inside node_modules
    //       /node_modules/.test(module.context) &&
    //       // and not a CSS file (due to extract-text-webpack-plugin limitation)
    //       !/\.css$/.test(module.request)
    //     )
    //   }
    // })
    // 静态文件拷贝
    new CopyWebpackPlugin([{
      context: './src/pages',
      from: '*/images/**',
    }]),
    new CopyWebpackPlugin([{
      context: './src/static',
      from: '**',
      to: 'static'
    }])
  ]
  // resolve: {
  //   alias: {'vue': 'vue/dist/vue.js' },
  // }
})

module.exports = config