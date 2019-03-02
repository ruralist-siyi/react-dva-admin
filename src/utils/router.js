/**
 * 判断 model 是否已经注册
 *
 * @param {*} app dva创建的app对象
 * @param {*} model model的namespace
 * @returns
 */
export function modelNotRegister(app, model) {
  // 更多的是返回false的情况，使用some
  return !app._models.some(({namespace}) => namespace === model);
}

/**
 * 依赖管理 ：使用 require.context() 方法来创建自己的（模块）上下文.https://webpack.docschina.org/guides/dependency-management/
 * @returns {*}
 */
export function getModelsObj() {
  // 3 个参数：要搜索的文件夹目录，是否还应该搜索它的子目录，以及一个匹配文件的正则表达式。
  const context = require.context('../models', true,  /(?<!Selector)\.js$/);
  return context.keys().reduce((prev, path) => {
    let reg = /\/(\w+)\.js$/;
    if (reg.test(path)) {
      prev[path.match(reg)[1]] = path;
    }
    return prev;
  }, {});
}