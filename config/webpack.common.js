const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");
// 抽离css样式，防止将样式打包在js中引起页面样式加载错乱的现象。
// extract-text-webpack-plugin does not work with webpack 4. Use mini-css-extract-plugin instead.
//This plugin should be used only on production builds without style-loader in the loaders chain, especially if you want to have HMR in development.
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin"); //静态资源输出
const AutoDllPlugin = require("autodll-webpack-plugin");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const WebpackNotifierPlugin = require("webpack-notifier");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const HappyPack = require("happypack");
const os = require("os");
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  // 入口起点：指定webpack默认使用哪个模版作为构建的开始。webpack来找出有那些模块和包是和入口七点直接和间接依赖的。（默认值为./src/index.js）
  entry: {
    bundle: "./src/index.js"
  },
  //出口: 告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，output 目录对应一个绝对路径。主输出文件默认为 ./dist/main.js，其他生成文件的默认输出目录是 ./dist。
  //__dirname 表示当前文件所在的目录的绝对路径,__filename 表示当前文件的绝对路径.process cwd() 方法返回 Node.js 进程当前工作的目录
  output: {
    filename: "js/[name].[hash].js",
    path: path.resolve(__dirname, "../dist")
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".less", ".json", ".css"],
    alias: {
      // src :path.resolve(__dirname, '../src'),
      // components :path.resolve(__dirname, '../src/components'),
      // utils :path.resolve(__dirname, '../src/utils'),
    },
    modules: ["node_modules"]
  },
  cache: true,
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
        //把对.js 的文件处理交给id为happyBabel 的HappyPack 的实例执行
        use: "happypack/loader?id=happyBabel"
      },
      {
        test: /\.(css|less)$/,
        // include: path.resolve(__dirname, '../src'), //限制范围，提高打包速度
        // exclude: /node_modules|\.module\.less$/,
        exclude: /\.module\.less$/,
        // use: ["style-loader", "css-loader", "postcss-loader"]
        use: [
          isProd ? MiniCssExtractPlugin.loader : "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true, // contaion .map file, use extract-text-webpack-plugin handle
              importLoaders: 2 // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
            }
          },
          "postcss-loader",
          {
            loader: "less-loader",
            options: {
              javascriptEnabled: true //antd styles dynamic import must true
            }
          }
        ]
      },
      {
        test: /\.module\.less$/,
        exclude: /node_modules/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true, // contaion .map file, use extract-text-webpack-plugin handle
              importLoaders: 3,
              modules: true,
              localIdentName: "[name]__[local]___[hash:base64:5]" // example .css .test-module__test___3r_2x {...}
            }
          },
          "resolve-url-loader",
          {
            loader: "less-loader",
            options: {
              javascriptEnabled: true //antd styles dynamic import musr true
            }
          },
          "postcss-loader"
        ]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            // 图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
            // 如下配置，将小于8192byte的图片转成base64码
            loader: "url-loader",
            options: {
              limit: "8192",
              name: "[name].[ext]?[hash]",
              useRelativePath: false,
              outputPath: function(fileName) {
                return "static/images/" + fileName;
              },
              publicPath: "static/images/"
            }
          },
          {
            loader: "image-webpack-loader", //压缩图片
            options: {
              bypassOnDebug: isProd
            }
          }
        ]
      },
      {
        test: /\.(eot|woff2?|ttf|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              name: "[name]-[hash:5].min.[ext]",
              limit: 5000, // fonts file size <= 5KB, use 'base64'; else, output svg file
              publicPath: "static/fonts/", //编译目录而已（/build/js/），不能用于html中的js引用。
              outputPath: "static/fonts/" //虚拟目录，自动指向path编译目录（/assets/ => /build/js/）。html中引用js文件时，必须引用此虚拟路径.
            }
          }
        ]
      }
    ]
  },
  //loader 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务，插件的范围包括：打包优化、资源管理和注入环境变量。
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
      inject: true, // will inject the main bundle to index.html
      hash: isProd, //为了更好的 cache，可以在文件名后加个 hash。
      minify: {
        removeComments: isProd, //移除HTML中的注释
        collapseWhitespace: isProd //把生成的 index.html 文件的内容的没用空格去掉，减少空间
      }
    }),
    // 这里是根据node-notifier这个node模块引申，社区中找到webpack-notifier，挺有意思。本来是打算使用WebpackDashboard，但是很鸡肋。
    new WebpackNotifierPlugin({
      title: "Webpack",
      excludeWarnings: true,
      alwaysNotify: true
    }),
    new HardSourceWebpackPlugin(),
    new HardSourceWebpackPlugin.ExcludeModulePlugin([
      {
        // HardSource works with mini-css-extract-plugin but due to how
        // mini-css emits assets, assets are not emitted on repeated builds with
        // mini-css and hard-source together. Ignoring the mini-css loader
        // modules, but not the other css loader modules, excludes the modules
        // that mini-css needs rebuilt to output assets every time.
        test: /mini-css-extract-plugin[\\/]dist[\\/]loader/
      }
    ]),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:8].css", //根据entry中的名字来命名，是静态的。
      chunkFilename: "static/css/[name].[contenthash:8].chunk.css" //chunkFilename是构建应用的时候生成的（用户也可以指定名字）
    }),
    // 可以通过配置shell做，可以不需要次插件。shell.cp('-R', 'static/*', assetsPath)
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "../static"), //拷贝文件夹下的所有资源
        to: "./static" //将资源拷贝到该出口文件的文件夹下
      }
    ]),
    new HappyPack({
      //用id来标识 happypack处理那里类文件
      id: "happyBabel",
      //如何处理  用法和loader 的配置一样
      loaders: [
        {
          loader: "babel-loader?cacheDirectory=true"
        }
      ],
      //共享进程池
      threadPool: happyThreadPool,
      //允许 HappyPack 输出日志
      verbose: true
    }),
    new AutoDllPlugin({
      inject: true, // will inject the DLL bundles to index.html
      filename: "[name].[hash].dll.js",
      path: "static/js",
      plugins: [
        new UglifyJsPlugin({
          sourceMap: !isProd
        })
      ],
      entry: {
        ReactStuff: [
          "react",
          "react-dom",
          "redux-logger",
          "redux-persist",
          "immutable",
          "reselect",
          "dva",
          "dva-loading"
        ],
        ToolStuff: ["lodash", "lodash-decorators", "crypto-js", "classnames"]
      }
    })
  ]
};
