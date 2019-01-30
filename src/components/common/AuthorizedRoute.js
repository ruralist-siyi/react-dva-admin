/**
 * @Description: 权限路由组件(参考: https://reacttraining.com/react-router/web/example/auth-workflow
 * @author siyi
 * @date 2019/1/293:22 PM
 * @contact dajiadoujiaowosiyi@163.com
*/
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'dva/router';
import { isFunction } from '../../utils';

const AuthorizedRoute = ({ component: Component, path, exact, strict, authority, redirect, route}) => {
  const isAuthenticated = isFunction(authority) ? authority : authority;
  return (
    <Route
      strict={strict || true} // /one/ 不匹配 /pne
      exact={exact} // /one 不匹配 /one/two
      path={path}
      // 这里不能使用component={() => {}}，router使用React.createElement根据给的component创建新的React元素。这里实用内联函数（inline-function）会产生不必要的重复装载。应使用render props；
      render={
        (props) => {
          if(!isAuthenticated || !Component) {
            return (
              <Redirect
                to={{
                  pathname: redirect,
                  state: { from: props.location}
                }}
              />
            )
          }else {
            // 给子路由传入当前的路由对象
            return (<Component route={route} {...props}/>)
          }
        }
      }
    />
  );
};

AuthorizedRoute.propTypes = {
  path: PropTypes.string.isRequired,
  component: PropTypes.any,
  exact: PropTypes.bool,
  authority: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  redirect: PropTypes.string,
  routesData: PropTypes.object,
};

export default AuthorizedRoute;
