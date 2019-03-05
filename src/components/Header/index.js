
import React from 'react';
import {Layout, Menu, Icon} from 'antd';
import styles from './Header.module.less';

const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;
/**
 *
 * @type {React.NamedExoticComponent<{toggleMenuCollapsed?: *, collapsed?: *}>}
 */
const LayoutHeader = React.memo(({toggleMenuCollapsed, collapsed}) => {
  return (
      <Header className={styles['layout-header']}>
        <Icon
          className={styles['toggle-icon']}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={toggleMenuCollapsed}
        />
      </Header>
  )
});

export default LayoutHeader;