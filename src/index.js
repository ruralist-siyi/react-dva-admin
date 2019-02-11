import React from 'react';
import ReactDOM from 'react-dom';
import dva from 'dva';
import createHistory from 'history/createBrowserHistory';
import {createLogger} from 'redux-logger';
import createLoading from 'dva-loading';
import Immutable from 'immutable';
import global from './models/global';
import './global.less';

const isDev = process.env.NODE_ENV === 'development';
const root = document.querySelector('#app');

const dvaConfig = {
  //配置 history 为 browserHistory， 这在里还需要webpack-dev-server配合
  history: createHistory(),
  //指定初始数据，优先级高于 model 中的 state，默认是 {}
  initialState: {},
  //如果我们用 antd，那么最简单的全局错误处理
  onError(e) {
    console.error(e);
  }
};
let app = dva(dvaConfig);

if(isDev) {
  import("react-hot-loader/root").then(({ hot }) => {
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
        // 收起@开头和persist开头的action，或者没有error时
        // if (action.type.match(/^(@)|(persist)/) || !logEntry.error) {
        //   return true;
        // }
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
const models = [global];
models.forEach(m => app.model(m));

// 配置路由
app.router(require('./router').default);

const App = app.start();

// https://github.com/dvajs/dva/issues/1229 :暴露出来可以拿到dispatch等方法。
export default app._store;

ReactDOM.render(<App/>, root);



