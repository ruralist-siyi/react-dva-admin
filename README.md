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

6.  css解析：style-loader css-loader postcss-loader autoprefixer mini-css-extract-plugin
    1. css-loader: 加载.css文件.
    2. style-loader: 使用<style>将css-loader内部样式注入到我们的HTML页面.
    3. postcss-loader: 自动添加浏览器前缀.



#### 二、babel工作流程
输入字符串 -> @babel/parser parser -> AST -> transformer[s] -> AST -> @babel/generator -> 输出字符串
