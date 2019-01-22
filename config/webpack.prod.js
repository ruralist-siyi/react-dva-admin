const glob = require('glob');
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        //每一次打包先清除dist目录下的上次打包文件。
        new CleanWebpackPlugin(['dist'],{
          root: path.resolve(__dirname , '../'),
          verbose: true,
        })
      ]
})