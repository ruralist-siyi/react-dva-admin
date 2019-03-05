import React from 'react';
import {Layout} from 'antd';
import MenuContent from './Menu';
import styles from './SiderMenu.module.less';

const {Sider} = Layout;
/**
 * 左侧菜单栏的组件
 * @type {React.NamedExoticComponent<{menusData?: *, collapsed?: *}>}
 */
const SiderMenu = React.memo(({collapsed, menusData}) => {
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
    >
      <div className={styles['menu-logo']}>
        <img src="http://www.chuanke.com/upload/courseware/f/31/3312428/image/09c68fe797fa58d78a1de4f34e0ea40f.gif" alt=""/>
        {collapsed ? null : <span className={styles['logo-name']}>react-dva-Admin</span>}
      </div>
      <MenuContent menusData={menusData}/>
    </Sider>
  )
});

export default SiderMenu;