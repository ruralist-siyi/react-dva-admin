const path = require('path');
const webpack = require('webpack'); 
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer:{
        contentBase:path.resolve(__dirname,'../dist'),// 设置服务器访问的基本目录
        host:'localhost',
        port:8080,
        open:true,
        inline: true,
        overlay: {//在页面上显示错误信息
            errors:true,
            },
        quiet: true, // lets WebpackDashboard do its thing
        historyApiFallback: true,
        hot:true //启用热更
      },
      plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()//热更相关插件
        ],  
})