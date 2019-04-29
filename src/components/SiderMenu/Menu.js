import React from 'react';
import {Menu, Icon} from 'antd';
import {Link} from 'dva/router';
import GlobalContext from '../../layouts/GlobalContext';
import styles from './SiderMenu.module.less';

const SubMenu = Menu.SubMenu;

/** TODO: 这块代码需要优化重构
 * 左侧菜单的具体菜单项组件
 * @type {React.NamedExoticComponent<{menusData?: *}>}
 */
const MenuContent = React.memo(({menusData, selectedKeys}) => {
  const defaultOpenKeys = selectedKeys ? ['/' + selectedKeys.split('/')[1]] : [];
  return (
    <GlobalContext.Consumer>
      {({theme: {menuTheme}}) => {
        return (
          <Menu
            defaultOpenKeys={defaultOpenKeys}
            selectedKeys={[selectedKeys]}
            className={styles['menus-wrap']}
            theme={menuTheme} mode="inline"
            defaultSelectedKeys={['1']}
          >
            {
              (menusData.toJS() || []).map((item) => {
                const iconPath = item.icon || null;
                if (item.children && Array.isArray(item.children)) {
                  return (
                    <SubMenu
                      key={item.path}
                      title={
                        <span>
                          {iconPath ? <Icon type={iconPath}/> : null}
                          <span>{item.title}</span>
                      </span>
                      }>
                      {
                        item.children.map((item) => (
                          <Menu.Item key={item.path}>
                            <Link
                              to={item.path}
                              replace={item.path === selectedKeys}
                            >{item.title} </Link>
                          </Menu.Item>

                        ))
                      }
                    </SubMenu>
                  )
                } else {
                  return (
                    <Menu.Item key={item.path}>
                      <Link
                        to={item.path}
                        replace={item.path === selectedKeys}
                      >{item.title} </Link>
                    </Menu.Item>
                  )
                }
              })
            }
          </Menu>
        )
      }}
    </GlobalContext.Consumer>
  )
});

export default MenuContent;
