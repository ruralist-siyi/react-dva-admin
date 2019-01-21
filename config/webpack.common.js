const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');
// 抽离css样式，防止将样式打包在js中引起页面样式加载错乱的现象。
// extract-text-webpack-plugin does not work with webpack 4. Use mini-css-extract-plugin instead.
//This plugin should be used only on production builds without style-loader in the loaders chain, especially if you want to have HMR in development.
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin"); //静态资源输出
const CleanWebpackPlugin = require('clean-webpack-plugin'); //每一次打包前先删除上次打包
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
     // 入口起点：指定webpack默认使用哪个模版作为构建的开始。webpack来找出有那些模块和包是和入口七点直接和间接依赖的。（默认值为./src/index.js）
    entry: {
        bundle: './src/index.js'
    },
    //出口: 告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，output 目录对应一个绝对路径。主输出文件默认为 ./dist/main.js，其他生成文件的默认输出目录是 ./dist。
    //__dirname 表示当前文件所在的目录的绝对路径,__filename 表示当前文件的绝对路径.process cwd() 方法返回 Node.js 进程当前工作的目录
    output: {
        filename: 'js/[name].[hash].js',
        path: path.resolve(__dirname, '../dist') 
    },
    resolve: {
        extensions: ['.js', '.jsx','.ts','.tsx', '.less','.json','.css'],
        alias: {
          // src :path.resolve(__dirname, '../src'),
          // components :path.resolve(__dirname, '../src/components'),
          // utils :path.resolve(__dirname, '../src/utils'),
        },
        modules: ['node_modules'],
      },
      //module：模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
    // loader: webpack 自身只支持 JavaScript。而 loader 能够让 webpack 处理那些非 JavaScript 文件，并且先将它们转换为有效 模块，然后添加到依赖图中，这样就可以提供给应用程序使用。
    module: {
        rules: [
            {
              test: /\.html$/,
              use: [
                {
                  loader: "html-loader"
                }
              ]
            },
            {
              test: /\.(js|jsx)$/,
              exclude: /node_modules/,
              use: {
                loader: "babel-loader"
              }
            },
            {
              test: /\.css$/,
              include: path.resolve(__dirname, '../src'), //限制范围，提高打包速度
              exclude: /node_modules/,
              // use: ["style-loader", "css-loader", "postcss-loader"]
              use: [
                isProd ? MiniCssExtractPlugin.loader : "style-loader",
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: true, // contaion .map file, use extract-text-webpack-plugin handle
                    importLoaders: 2, // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
                    // Minimize: isProd,
                  }
                },
                'postcss-loader'
                ],
            },
        ]
    },
    //loader 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务，插件的范围包括：打包优化、资源管理和注入环境变量。
    plugins: [
      //每一次打包先清除dist目录下的上次打包文件。
      new CleanWebpackPlugin(['dist'],{
        root: path.resolve(__dirname , '../'),
        verbose: true,
      }),
      new HtmlWebPackPlugin({
        template: "./src/index.html",
        filename: "./index.html",
        hash: isProd, //为了更好的 cache，可以在文件名后加个 hash。
        minify: {
          removeComments: isProd,  //移除HTML中的注释
          collapseWhitespace: isProd, //把生成的 index.html 文件的内容的没用空格去掉，减少空间
        },
      }),
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:8].css',//根据entry中的名字来命名，是静态的。
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css', //chunkFilename是构建应用的时候生成的（用户也可以指定名字）
      }),
      // 可以通过配置shell做，可以不需要次插件。shell.cp('-R', 'static/*', assetsPath)
      new CopyWebpackPlugin([{
        from: path.resolve(__dirname, '../static'),        //拷贝文件夹下的所有资源
        to:'./static'                        //将资源拷贝到该出口文件的文件夹下
    }])
    ]
}