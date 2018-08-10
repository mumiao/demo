const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MultipagePlugin = require('./html-relativepath-plugin');
const TransformModulesPlugin = require('webpack-transform-modules-plugin');
const alias = require('./alias.js');


const pagesPath = './src/pages/*/*.html';

var pages = [];
glob.sync(pagesPath).forEach(function (filepath) {
  const dir = path.dirname(filepath);
  const pathdir = filepath.slice(filepath.lastIndexOf('/'),filepath.length-5);
  const filename = dir.substr(dir.lastIndexOf('/') + 1) + pathdir;
  pages.push({
    filename,
    dir,
    pathdir,
  });
});

const plugins = pages.map((page) => {
  return new HtmlWebpackPlugin({
    filename: page.filename +'.html' ,
    template: page.dir + page.pathdir+'.html',
    inject: true,
    chunks: [page.filename],
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
    },
    chunksSortMode: 'dependency'
  })
});
// cube-ui依赖插件
plugins.push(new TransformModulesPlugin());

const entry = {};
pages.forEach((page) => {
  entry[page.filename] = page.dir + '/index.js';
});

module.exports = {
  entry: entry,
  resolve: {
    extensions: ['.js', '.json'],
    alias: alias,
  },
  module: {
    rules: [{
        test: /\.html$/,
        use: ['html-withimg-loader', 'raw-loader'],
        exclude: /(node_modules)/
      },
      {
        test: /\.js$/,
        use: ['babel-loader', 'eslint-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        use: ['vue-loader']
      },
      {
        test: /\.(css|scss)$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader?minimize', 'postcss-loader', 'sass-loader']
        })
      },
      // {
      //   test: /\.scss$/,
      //   use: ExtractTextPlugin.extract({
      //     use: ['css-loader?minimize', 'postcss-loader', 'sass-loader']
      //   })
      // }
    ]
  },
  plugins: plugins,
}