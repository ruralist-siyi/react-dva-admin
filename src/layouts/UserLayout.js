import React, {Component} from 'react';
import styles from './UserLayout.module.less';
import AuthorizedRoute from '../components/common/AuthorizedRoute';
import {routerRedux, Route, Switch, Redirect} from 'dva/router';
import {connect} from 'dva';
import Login from '../containers/Login';
import {Bind} from "lodash-decorators";

@connect(({routing, global}) => ({
  pathname: routing.location.pathname,
  routesData: global.get('routesData')
}))
class UserLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  @Bind()
  renderUserRoutes() {
    const {pathname, routesData} = this.props;
    let routers = [];
    if(routesData && Array.isArray(routesData)) {
      for(let value of routesData) {
       if(value.path && value.path === '/user') {
         if(value.routes && Array.isArray(value.routes)) {
            routers = value.routes.map((item) => {
             const {path, redirect, component} = item;
             return <Route component={component} path={path} redirect={redirect} authority={true}/>
           })
         }
       }
      }
    }
  return routers;
  }

  render() {
    return (
      <React.Fragment>
        <div className={styles['user-wrap']}>
          <div className={styles['login-content']}>
            <AuthorizedRoute component={Login} path='/user/login' authority={true}/>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default UserLayout;