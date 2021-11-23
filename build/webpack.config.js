const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: "production",
  entry: {
    index: "./src/index.js",
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "js/[name].[hash:8].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        ]
      },
      {
        test: /\.s?[ac]ss$/,
        exclude: /node_modules/,
        use: [
          // 将 JS 字符串生成为 style 节点
          MiniCssExtractPlugin.loader,
          // 将 CSS 转化成 CommonJS 模块
          'css-loader',
          // 将 Sass 编译成 CSS
          'sass-loader',
        ],
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../index.html'),
      filename: 'index.html',
      inject: true,
    }),
    //从js提取css插件
    new MiniCssExtractPlugin({
      // 设置输出的文件目录和重设文件名
      filename: 'css/[name].css'
    })
  ],
  devServer: {
    port: 3031,
    open: true,
    hot: true
  },
  performance: {
    hints: false
  }
}