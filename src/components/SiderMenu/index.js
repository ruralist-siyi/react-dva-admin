import React from 'react';
import {Layout} from 'antd';
import MenuContent from './Menu';
import styles from './SiderMenu.module.less';

const {Sider} = Layout;
/**
 * 左侧菜单栏的组件
 * @type {React.NamedExoticComponent<{menusData?: *, collapsed?: *}>}
 */
const SiderMenu = React.memo(({collapsed, menusData, selectedKeys}) => {
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={250}
      className={styles['sider']}
    >
      <div className={styles['menu-logo']}>
        <img src="/static/images/logo.gif" alt=""/>
        {collapsed ? null : <span className={styles['logo-name']}>Antd-dva-Admin</span>}
      </div>
      <MenuContent selectedKeys={selectedKeys} menusData={menusData}/>
    </Sider>
  )
});

export default SiderMenu;