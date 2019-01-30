/**
 * @Description: 路由配置文件，动态加载组件
 * @author siyi
 * @date 2019/1/293:27 PM
 * @contact dajiadoujiaowosiyi@163.com
 */
import React from 'react';
// import Loadable from 'react-loadable';
import Loading from '../components/common/Loading';
//https://webpack.docschina.org/guides/dependency-management/ 依赖管理 ：使用 require.context() 方法来创建自己的（模块）上下文
const context = require.context('../models', true, /\.js$/); //3 个参数：要搜索的文件夹目录，是否还应该搜索它的子目录，以及一个匹配文件的正则表达式。
// 将model和它的路径存在map里
let modelMap = context.keys().reduce((prev, path) => {
  let reg = /\/(\w+)\.js$/;
  if (reg.test(path)) {
    prev[path.match(reg)[1]] = path;
  }
  return prev;
}, {});

/**
 * 判断 model 是否已经注册
 *
 * @param {*} app dva创建的app对象
 * @param {*} model model的namespace
 * @returns
 */
function modelNotRegister(app, model) {
  // 更多的是返回false的情况，使用some
  return !app._models.some(({namespace}) => namespace === model);
}

/**
 * 组件动态的wrapper Code-Splitting ：去除react-loadable 使用新API lazy and suspense
 * 动态加载组件，动态注册model
 *
 * @param {*} app
 * @param {*} [models=[]]
 * @param {*} component
 * @returns
 */
function dynamicWrapper(app, models = [], component) {
  const LazyComponent = component;
  // 如果该model已经注册，才加载
  models.map((model) => {
    if (modelNotRegister(app, model)) {
      if (!modelMap[model]) {
        console.error('model 注册失败，找不到 model: ' + model);
        return null;
      }
      app.model(context(modelMap[model]).default);
    }
    return null;
  });
  // Code-Splitting
  return props => (
    <React.Suspense fallback={<Loading inner={true} loading={true}/>}>
      <LazyComponent {...props} />
    </React.Suspense>
  );
  /*return Loadable({
    delay: 1000, //超时未加载的显示loading
    loader: () => {
      return component().then(raw => {
        const Component = raw.default || raw;
        return props => <Component {...props} />;
      })
    },
    loading: () => <Loading inner={true} loading={true} />
  });*/
}


// 始化路由配置方法，检测配置路由的权限是否存在，如果没有配置权限，默认设为false，检测配置路由的强匹配（exact）是否存在，如果没有配置，默认设为true
export const initRoutesData = (app) => {
  // 路由配置对象
  let routesData = {
    '/index': {
      exact: false,
      authority: true,
      abstract: true,
      // component: dynamicWrapper(app, [], () => import('../layouts/IndexLayout')),
    },
    '/': {
      exact: true,
      authority: true,
      abstract: true,
      component: dynamicWrapper(app, [], React.lazy(() => import('../layouts/BasicLayout'))),
    },
  };

  for (const path in routesData) {
    if (routesData[path].authority === undefined) {
      routesData[path].authority = false;
    }
    if (routesData[path].exact === undefined) {
      routesData[path].exact = true;
    }
    routesData[path].path = path;
  }
  return routesData;
};