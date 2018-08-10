/**
 * 插件别名配置
 */
var path = require('path');
// var containerPath = path.resolve('./');

//	别名
var alias = {
  // 'vue': path.resolve(containerPath, './node_modules/vue/dist/vue.min.js'),
  'vue': 'vue/dist/vue.js',
  // 'vux-components': path.resolve(containerPath, './node_modules/vux/src/components'),
  'vux-components': 'vux/src/components',
  // cube-ui
  'cube-ui': 'cube-ui/lib',
  'plugins': path.resolve(__dirname, '../src/plugins'),
  lib: path.resolve(__dirname, '../src/lib'),
  common: path.resolve(__dirname, '../src/common'),
};


module.exports = alias;
