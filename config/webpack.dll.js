// const webpack = require('webpack');
// const path = require('path');
// const fs = require('fs');

// module.exports = {
//     mode: 'production',
//     entry: {
//         ReactStuff: [
//             'react', 
//             'react-dom',
//             'redux-logger',
//             'redux-persist',
//             'immutable',
//             'reselect',
//             'dva',
//             'dva-loading'
//         ],
//         UIStuff: [
//             'antd',
//             'viewerjs'
//         ],
//         ToolStuff: [
//             'lodash',
//             'lodash-decorators',
//             'crypto-js',
//             'classnames'
//         ]

//     },
//     output: {
//         path: path.join(__dirname, '../static/js'),
//         filename: '[name].dll.js',
//         library: '[name]_library' ,
//     },
//     plugins: [ 
//         // Dllplugin插件将生成一个manifest.json文件，该文件供webpack.config.js中加入的DllReferencePlugin使用，使我们所编写的源文件能正确地访问到我们所需要的静态资源（运行时依赖包）。
//         new webpack.DllPlugin({
//           path: path.join(__dirname, '../', '[name]-manifest.json'),
//           name: '[name]_library', 
//            context: __dirname //须必须同webpack.config.js中DllReferencePlugin插件的context所指向的上下文保持一致
//         }),
//     ]
// }