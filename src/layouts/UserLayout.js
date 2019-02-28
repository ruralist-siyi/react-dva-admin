import React, {Component} from 'react';
import styles from './UserLayout.module.less';
import AuthorizedRoute from '../components/common/AuthorizedRoute';
import {routerRedux, Route, Switch, Redirect} from 'dva/router';
import {connect} from 'dva';
import LoginForm from '../components/Login/LoginForm';
import {Bind} from "lodash-decorators";

@connect()
class UserLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <React.Fragment>
        <div className={styles['user-wrap']}>
          <div className={styles['login-content']}>
            {/* <img className={styles['login-logo']} src="/static/images/login-logo.png" alt=""/> */}
            <AuthorizedRoute component={LoginForm} path='/user/login' authority={true}/>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default UserLayout;