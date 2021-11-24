const { merge } = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base')

module.exports = merge(webpackBaseConfig, {
  mode: 'development',
  // 开发工具，开启 source map，编译调试
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    port: 3031,
    open: true,
    hot: true
  },
  performance: {
    hints: false
  }
})
