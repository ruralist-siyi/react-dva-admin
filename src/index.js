import React from 'react';
import ReactDOM from 'react-dom';
import dva from 'dva';
import { createBrowserHistory } from 'history';
import {createLogger} from 'redux-logger';
import {notification} from 'antd'
import createLoading from 'dva-loading';
import { persistStore, autoRehydrate } from 'redux-persist';
import { asyncSessionStorage } from 'redux-persist/storages';
import { createPersistCryptoTransform } from './utils/persistCryptoTransform';
import Immutable from 'immutable';
import global from './models/global';
import user from './models/user';
import './global.less';

const isDev = process.env.NODE_ENV === 'development';

const dvaConfig = {
  // 配置 history 为 browserHistory， 这在里还需要webpack-dev-server配合
  // https://github.com/dvajs/dva/issues/2039
  history: createBrowserHistory(),
  // 指定初始数据，优先级高于 model 中的 state，默认是 {}
  initialState: {},
  // 如果我们用 antd，那么最简单的全局错误处理
  // 指定额外的 StoreEnhancer ，结合 redux-persist
  extraEnhancers: [autoRehydrate()],
  onError(error) {
    // 必须要preventDefault，否则错误还是会抛出
    error.preventDefault();
    // 全局error处理
    notification.error({
      key: error.name,
      message: error.name,
      description: error.message,
    });
    console.log(error);
  }
};
let app = dva(dvaConfig);

if (isDev) {
  import("react-hot-loader/root").then(({hot}) => {
    app = hot(dva(dvaConfig));
  });
}

// 使用dva-loading进行loading状态管理
app.use(createLoading());

if (isDev) {
  app.use({
    // redux-logger
    onAction: createLogger({
      collapsed: (getState, action, logEntry) => {
        // 收起所有的log,需要看哪个再展开
        return true;
      },
      // 这里因为我们使用了immutable库，store中的数据都是immutable数据，进行了展示转换。
      stateTransformer: (state) => {
        let newState = {};
        for (const i of Object.keys(state)) {
          if (Immutable.Iterable.isIterable(state[i])) {
            newState[i] = state[i].toJS();
          } else {
            newState[i] = state[i];
          }
        }
        return newState;
      }
    }),
  });
}

// 默认只导入 global, setting, user
// 这三个是基本的model，其他model属于业务model，在controller中需要及时对数据进行清理
const models = [global, user];
models.forEach(m => app.model(m));

// 配置路由
app.router(require('./router').default);

const App = app.start();

// redux.persist 本地持久化
persistStore(app._store, {
  // blacklist array keys (read: reducers) to ignore
  // whitelist array keys (read: reducers) to persist, if set all other keys will be ignored.
  // storage object a conforming storage engine.
  storage: asyncSessionStorage,
  // transforms array transforms to be applied during storage and during rehydration.
  transforms: [createPersistCryptoTransform({secretKey: 'persist'})],
  // debounce integer debounce interval applied to storage calls (in miliseconds).
  // keyPrefix string change localstorage default key (default: reduxPersist:)
  // 存储时的key
  keyPrefix: 'persist-',
  // 想要持久化的state的键名的数组
  whitelist: ['global', 'user'],
}, (err, state) => {
  if (!err) {
    ReactDOM.render(
      <App />,
      document.querySelector('#app')
    );
  } else {
    console.error(err);
  }
});

// https://github.com/dvajs/dva/issues/1229 :暴露出来可以拿到dispatch等方法。
export default app._store;



