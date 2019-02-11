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

export function getModelsObj() {
  const context = require.context('../models', true, /\.js$/);
  return context.keys().reduce((prev, path) => {
    let reg = /\/(\w+)\.js$/;
    if (reg.test(path)) {
      prev[path.match(reg)[1]] = path;
    }
    return prev;
  }, {});
}