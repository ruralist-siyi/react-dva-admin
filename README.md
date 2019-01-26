# react-dva-admin

#### 一、webpack配置

1. npm init 初始化package.json

2. npm i webpack webpack-cli --save-dev： webapck4将你命令行中的操作都放在了webpack-cli上了，这个必须装。

3. 配置package.json的script: 定义npm的脚本字段。

4. 安装babel解析的插件：（babel7之后官方给package加上了scope（@babel命名空间），用来区分是否为官方插件）
    1. babel-loader: this package allows transpiling JavaScript files using Babel and webpack。
    2. @babel/core: 核心编译解析,包括了整个babel工作流。
    3. @babel/preset-env: 该preset可以通过你配置的目标浏览器或者实时运行环境来自动地选择Babel插件和polyfills来完成ES2015+代码的编译。取代以前我们大多使用babel-preset-es20xx。
    4. @babel/preset-react：这个集成了很多react比如说jsx解析等插件。
    5. @babel/plugin-proposal-decorators： 用来解析我们js装饰器的插件。
    6. @babel/plugin-proposal-class-properties: This plugin transforms static class properties as well as properties declared with the property initializer syntax.
    7. @babel/polyfill: 改全局的对象的原型，添加不兼容的 api 方法，或者修改不兼容的 api 方法。可以解析js的新方法：Promise、WeakMap、Array.from、Object.assgin等。避免极少数浏览器（IE）的兼容问题。（https://babeljs.io/docs/en/babel-polyfill/）（这个是在你的source code 前运行的，所以安装的时候是 --save）
    8. @babel/plugin-transform-runtime: 1. 如果你想使用 generator ， 有两个办法，一个就是引入 bable-polyfill 这个大家伙儿，另一个就是使用这个插件. 2. 就是能帮助我们解决一些高级语法的问题，它会在构建时帮你自动引入，用到什么引什么。 3. 它的缺陷是它只能帮我们引入静态方法和一些内建模块，如 Object.assign Promise 等。实例方法是不会做转换的，如 "foobar".includes("foo") . (https://babeljs.io/docs/en/babel-plugin-transform-runtime/)。
    9. @babel/plugin-syntax-dynamic-import：按需加载。
    Note: @babel/preset-env，@babel/polyfill、@babel/plugin-transform-runtime我们三者选择其一。polyfill的缺点在于他体积太大、会作用与全局对象。所以如果你是开发一个框架或者一个类库的时候建议不要使用polyfill。但是个人开发项目，可以使用polyfill，因为他是比较稳妥的方式。babel-runtime是按需引入打包体积最小的方式，但是不能模拟实例方法。babel-preset-env（开启useBuiltIns:根据当前配置的环境去加载对应的一系列插件）。这个体积折中，也是按需加载，但是他可配置性高。

5. .babelrc：Babel 会在正在被转录的文件的当前目录中查找一个 .babelrc 文件。 如果不存在，它会遍历目录树，直到找到一个 .babelrc 文件，或一个 package.json 文件中有 “babel”: {} 。

6.  css解析：style-loader css-loader postcss-loader less-loader autoprefixer resolve-url-loader mini-css-extract-plugin
    1. css-loader: 加载.css文件.
    2. style-loader: 使用<style>将css-loader内部样式注入到我们的HTML页面.
    3. postcss-loader autoprefixer: 自动添加浏览器前缀.
    4. mini-css-extract-plugin: webpack4版本应该使用的将css单独提取打包的插件。extract-text-webpack-plugin已废弃。
    5. less-loader: 解析我们的less文件。
    6. resolve-url-loader：解决样式中的url引用相对路径不会自动变化的问题。

7. copy-webpack-plugin: 静态资源的拷贝也可以解决我们img标签的src路径引用不准确的问题。

8. clean-webpack-plugin： 每一次build前先删除上一次build的文件夹。

9. webpack-merge： 拆分配置文件，可以进行配置的合并。

10. friendly-errors-webpack-plugin：在开发环境下，清除命令行中很多繁杂的信息。配置dev-server将错误信息暴露在网页上。

11. webpack-notifier： 挺有意思的一个webpack打包是否成功的提示框。

12. autodll-webpack-plugin: 用来代替webpack.Dllplugin的插件。以往使用都是需要打完dll包后手动引入到index.html不会自动插入正确的路径，而且以前的配置起来也比较复杂，这个插件简化了我们的操作。但是在未来webpack5的时候，就不需要将我们的几乎每次都不会变化的基础类库重复打包，也不需要dll来帮助我们提前打好这个公共包。（that webpack 5 planning to support caching out-of-the-box, AutoDllPlugin will soon be obsolete.）

13. hard-source-webpack-plugin：通过缓存的方式来提升我们的构建速度。以往我们可以通过webpack添加cache：true或者是对babel-loader设置cacheDirectory：true。hard-source-webpack-plugin是给我们提供了一个中间缓存的模块，增加了我们的构建速度。这种缓存式的优化，或许就是webpack5的方向。

14. happypack：将原有的 webpack 对 loader 的执行过程，从单一进程的形式扩展为多进程的模式，从而加速代码构建。对 js 和 ts 文件使用 happypack 收益最大。（据说vue-loader不能被happypack很好的支持。thread-loader可以通过将指定loader放入一个worker 池中，每个 worker 都是一个单独的有 600ms 限制的 node.js 进程，通过限制他们的行为，来解决loader耗时问题。thread-loader不可以和 mini-css-extract-plugin 结合使用。）


#### 二、babel工作流程
输入字符串 -> @babel/parser parser -> AST -> transformer[s] -> AST -> @babel/generator -> 输出字符串
