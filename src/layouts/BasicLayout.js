import React from 'react';
import {Layout, Menu, Breadcrumb, Icon,} from 'antd';
import memoizeOne from 'memoize-one';
import DocumentTitle from 'react-document-title';
import {connect} from 'dva';
import SiderMenu from '../components/SiderMenu';
import LayoutHeader from '../components/Header';
import Bread from '../components/Bread';
import GlobalContext from './GlobalContext';
import {Bind} from "lodash-decorators";
import {routerRedux, Route, Switch, Redirect} from 'dva/router';
import AuthorizedRoute from '../components/common/AuthorizedRoute';

const {Content} = Layout;

/**
 * https://github.com/dvajs/dva/issues/65
 * shouldComponentUpdate 已经在 connect 时处理过了，组件层不需要再加，追求性能的话可以在 connect 时引入 reselect 做缓存处理
 */
@connect(({global, routing}) => ({
  menuCollapsed: global.get('menuCollapsed'),
  menusData: global.get('menusData'),
  formatMenusData: global.get('formatMenusData'),
  pathname: routing.location.pathname,
  routesData: global.get('routesData')
}))
class BasicLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  /**
   * 切换左侧菜单栏是否展开
   */
  @Bind()
  toggleMenuCollapsed() {
    this.props.dispatch({
      type: 'global/toggleMenuCollapsed'
    })
  }

  @Bind()
  renderRoutes() {
    const {routesData} = this.props;
    let routes = [];
    for(let path in routesData) {
      routes.push(
        <AuthorizedRoute exact={true} component={routesData[path].component} path={path} authority={() => sessionStorage.getItem('token')}/>
      )
    }
    return routes;
  }

  /**
   * 渲染总体布局中的组件
   * @returns {*}
   */
  @Bind()
  renderLayoutContent() {
    const {menuCollapsed, location, menusData, formatMenusData, routesData, pathname} = this.props;
    return (
      <>
        <SiderMenu
          collapsed={menuCollapsed}
          menusData={menusData}
          selectedKeys={pathname}
        />
        <Layout>
          <LayoutHeader
            toggleMenuCollapsed={this.toggleMenuCollapsed}
            collapsed={menuCollapsed}
          />
          <Bread
            formatMenusData={formatMenusData}
            location={location}
            routesData={routesData}
          />
          <Content style={{
            margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280,
          }}
          >
            <Switch>
              {
                this.renderRoutes()
              }
            </Switch>
          </Content>
        </Layout>
      </>
    )
  }

  render() {
    return (
      <React.Fragment>
        <GlobalContext.Provider value={{
          theme: {
            menuTheme: 'dark'
          }
        }}>
          <DocumentTitle title='首页'/>
          <Layout>
            {this.renderLayoutContent()}
          </Layout>
        </GlobalContext.Provider>
      </React.Fragment>
    )
  }
}

export default BasicLayout;