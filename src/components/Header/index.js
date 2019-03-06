
import React from 'react';
import {Layout, Icon} from 'antd';
import styles from './Header.module.less';

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
      </Header>
  )
});

export default LayoutHeader;