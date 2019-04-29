
import React from 'react';
import {Layout, Icon, Menu, Avatar} from 'antd';
import styles from './Header.module.less';

const SubMenu = Menu.SubMenu;
const {Header} = Layout;
/**
 * 布局头部组件
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
        <Menu key="user-profile" mode="horizontal">
          <SubMenu
            title={
              <>
                <span>xxx</span>
                <Avatar style={{ marginLeft: 8 }} />
              </>
            }
          >
            <Menu.Item key="logout">
              退出登录
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Header>
  )
});

export default LayoutHeader;
