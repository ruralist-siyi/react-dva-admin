const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
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
    })
  ],
})