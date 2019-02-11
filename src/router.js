/**
 * @Description: 定义路由组件，暴露路由对象
 * @author siyi
 * @date 2019/1/293:20 PM
 * @contact dajiadoujiaowosiyi@163.com
*/
import React from 'react';
import {routerRedux, Route, Switch, Redirect} from 'dva/router';
// antd 国际化配置
import {LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {getRoutesConfig} from './routes';
import AuthorizedRoute from './components/common/AuthorizedRoute';
import store from './index';
import UserLayout from './layouts/UserLayout';
import BasicLayout from './layouts/BasicLayout';
//ConnectedRouter 为 react-router-redux 内的对象 routerRedux 的标签，
//作用相当于  react-router-dom 中的 BrowserRouter 标签，作用为连接 redux 使用。
const {ConnectedRouter} = routerRedux;

// 定义路由组件
const Router = ({history, routesData}) => {
  return (
    <LocaleProvider locale={zhCN}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/user" component={UserLayout}/>
          <AuthorizedRoute
            path={'/'}
            component={BasicLayout}
            exact={false}
            authority={false}
            redirect={'/user/login'}
          />
        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  );
};

export default function getRouter({history, app}) {
  const routesConfig = getRoutesConfig(app);
  store.dispatch({type: 'global/startApp', payload: routesConfig});
  return (
    <Router history={history} routesData={routesConfig}/>
  );
};