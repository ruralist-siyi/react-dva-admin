import React from 'react';
import {Layout, Menu, Breadcrumb, Icon} from 'antd';
import MenuContent from './Menu';
import GlobalContext from '../../layouts/GlobalContext';
const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;

const SiderMenu = React.memo(({collapsed, menusData}) => {
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
    >
      <div className="logo"/>
      <MenuContent menusData={menusData}/>
    </Sider>
  )
});

export default SiderMenu;