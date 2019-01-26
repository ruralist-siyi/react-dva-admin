const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  // webpack-dev-server输出的文件只存在于内存中,
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),// 设置服务器访问的基本目录
    host: 'localhost',
    open: true,
    compress: true, // 开启gzip
    inline: true,
    overlay: true, //在页面上显示错误信息: 本来打算使用redbox-react，但是发现没必要
    quiet: true, // lets WebpackDashboard do its thing ，禁止显示devServer的console信息
    historyApiFallback: true, // BrowserHistory:用来应对返回404页面时定向到特定页面
    hot: true //启用热更
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`Your application is running here:localhost:8080`],
      },
      clearConsole: true,
    }),
    // 这里是根据node-notifier这个node模块引申，社区中找到webpack-notifier，挺有意思。本来是打算使用WebpackDashboard，但是很鸡肋。
    new WebpackNotifierPlugin({
      title: 'Webpack',
      excludeWarnings: true,
      alwaysNotify: true
    })
  ],
})