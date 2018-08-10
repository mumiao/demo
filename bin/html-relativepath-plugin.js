const path = require('path');

function MultipagePlugin() {

}

MultipagePlugin.prototype.apply = function (compiler) {
  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlPluginData, callback) {
      htmlPluginData.assets.css = htmlPluginData.assets.css.map((item) => {
        const curPath = path.dirname(htmlPluginData.outputName)
        return './' + path.relative(curPath, path.join(curPath, item));
      })
      htmlPluginData.assets.js = htmlPluginData.assets.js.map((item) => {
        const curPath = path.dirname(htmlPluginData.outputName)
        return './' + path.relative(curPath, path.join(curPath, item));
      })
      callback(null, htmlPluginData);
    });
  });
};

module.exports = MultipagePlugin;