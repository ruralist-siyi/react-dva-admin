import React from 'react';
import {Layout, Menu, Breadcrumb, Icon,} from 'antd';
import memoizeOne from 'memoize-one';
import DocumentTitle from 'react-document-title';
import {connect} from 'dva';
import SiderMenu from '../components/SiderMenu';
import GlobalContext from './GlobalContext';
import Menus from '../constants/menus';
import {Bind} from "lodash-decorators";

const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;

@connect(({global}) => ({
  menuCollapsed: global.get('menuCollapsed')
}))
class BasicLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menusData: new Menus().getAllMenusDatta()
    }
  }

  @Bind()
  toggleMenuCollapsed() {
    this.props.dispatch({
      type: 'global/toggleMenuCollapsed'
    })
  }

  @Bind()
  renderLayoutContent() {
    const {menuCollapsed} = this.props;
    return (
      <>
        <SiderMenu
          collapsed={menuCollapsed}
          menusData={this.state.menusData}
        />
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