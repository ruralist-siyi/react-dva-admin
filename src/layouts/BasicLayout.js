import React from 'react';
import {Layout} from 'antd';
import memoizeOne from 'memoize-one';
import DocumentTitle from 'react-document-title';
import {connect} from 'dva';
import SiderMenu from '../components/SiderMenu';
import LayoutHeader from '../components/Header';
import Bread from '../components/Bread';
import GlobalContext from './GlobalContext';
import {Bind} from "lodash-decorators";
import {Switch} from 'dva/router';
import deepEqual from 'lodash/isEqual';
import styles from './BasicLayout.module.less';
import AuthorizedRoute from '../components/common/AuthorizedRoute';
import {fromJS} from "immutable";

const {Content} = Layout;

/**
 * https://github.com/dvajs/dva/issues/65
 * shouldComponentUpdate 已经在 connect 时处理过了，组件层不需要再加，追求性能的话可以在 connect 时引入 reselect 做缓存处理
 */
@connect(({global, routing}) => ({
  global: global,
  menuCollapsed: global.get('menuCollapsed'),
  authorizedMenusData: global.get('authorizedMenusData') || fromJS([]),
  authorizedRoutesData: global.get('authorizedRoutesData') || fromJS({}),
  formatMenusData: global.get('formatMenusData'),
  authorizedPathList: global.get('authorizedPathList'),
  pathname: routing.location.pathname,
  routesData: global.get('routesData') || fromJS({})
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

  /**
   *  渲染权限路由组件
   * @returns {Array}
   */
  renderMemoizationRoutes = memoizeOne((routesData = {}, authorizedPathList = []) => {
    let routes = [];
    for (let path in routesData) {
      routes.push(
        <AuthorizedRoute
          key={path}
          exact={true}
          component={routesData[path].component}
          path={path}
          redirect={routesData[path].redirect}
          authority={() => sessionStorage.getItem('token') && authorizedPathList.includes(path)}
        />
      )
    }
    return routes;
  }, deepEqual);

  /**
   * 渲染总体布局中的组件
   * @returns {*}
   */
  @Bind()
  renderLayoutContent() {
    const {menuCollapsed, location, authorizedPathList, routesData, formatMenusData, authorizedRoutesData, pathname, authorizedMenusData} = this.props;
    console.log(this.renderMemoizationRoutes(routesData.toJS(), authorizedPathList.toJS()));
    return (
      <>
        <SiderMenu
          collapsed={menuCollapsed}
          menusData={authorizedMenusData}
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
            routesData={authorizedRoutesData}
          />
          <Content style={{
            margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280,
          }}
          >
            <Switch>
              {
                this.renderMemoizationRoutes(routesData.toJS(), authorizedPathList.toJS())
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
          <Layout className={styles['all-content-wrap']}>
            {this.renderLayoutContent()}
          </Layout>
        </GlobalContext.Provider>
      </React.Fragment>
    )
  }
}

export default BasicLayout;
