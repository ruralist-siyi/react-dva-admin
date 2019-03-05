import React from 'react';
import {Layout, Menu, Breadcrumb, Icon,} from 'antd';
import memoizeOne from 'memoize-one';
import DocumentTitle from 'react-document-title';
import {connect} from 'dva';
import SiderMenu from '../components/SiderMenu';
import LayoutHeader from '../components/Header';
import GlobalContext from './GlobalContext';
import Menus from '../constants/menus';
import {Bind} from "lodash-decorators";

const {Content} = Layout;

@connect(({global}) => ({
  menuCollapsed: global.get('menuCollapsed')
}))
class BasicLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menusData: new Menus().getAllMenusData()
    }
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
   * 渲染总体布局中的组件
   * @returns {*}
   */
  @Bind()
  renderLayoutContent() {
    const {menuCollapsed} = this.props;
    return (
      <>
        <SiderMenu
          collapsed={menuCollapsed}
          menusData={this.state.menusData}
        />
        <Layout>
          <LayoutHeader
            toggleMenuCollapsed={this.toggleMenuCollapsed}
            collapsed={menuCollapsed}
          />
          <Content style={{
            margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280,
          }}
          >
            Content
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