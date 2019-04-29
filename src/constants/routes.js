/**
 * @Description: 路由配置文件，动态加载组件
 * @author siyi
 * @date 2019/1/293:27 PM
 * @contact dajiadoujiaowosiyi@163.com
 */
import React from 'react';
// import Loadable from 'react-loadable';
import Loading from '../components/common/Loading';
import {modelNotRegister, getModelsObj} from '../utils/router';

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
  const modelsObj = getModelsObj();
  // 如果该model已经注册，才加载
  models.map((model) => {
    if (modelNotRegister(app, model)) {
      if (!modelsObj[model]) {
        console.error('model 注册失败，找不到 model: ' + model);
        return null;
      }
      app.model(context(modelsObj[model]).default);
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


/**
 * 获取路由配置
 * @param app
 * @returns {{path: string, routes: *[], component: *, name: string}[]}
 */
export const getRoutesConfig = (app) => {
  return {
    '/user/login': {
      title: '登录',
      component:  dynamicWrapper(app, [], React.lazy(() => import('../containers/Login'))),
      authority: true
    },
    '/workBench/complete': {
      title: '已办任务',
      component: dynamicWrapper(app, [], React.lazy(() => import('../containers/WorkBench/CompleteWork')))
    },
    '/workBench/pending': {
      title: '待办任务',
      component: dynamicWrapper(app, [], React.lazy(() => import('../containers/WorkBench/PendingWork')))
    },
    '/workBench/pending1': {
      title: '待办任务1',
      component: dynamicWrapper(app, [], React.lazy(() => import('../containers/WorkBench/PendingWork')))
    },
  }
};
