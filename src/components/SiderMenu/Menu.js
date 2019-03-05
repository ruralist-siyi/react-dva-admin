import React from 'react';
import {Menu, Icon} from 'antd';
import { Link } from 'dva/router';
import GlobalContext from '../../layouts/GlobalContext';

const SubMenu = Menu.SubMenu;
/**
 * 左侧菜单的具体菜单项组件
 * @type {React.NamedExoticComponent<{menusData?: *}>}
 */
const MenuContent = React.memo(({menusData}) => {
  console.log(menusData);
  return (
    <GlobalContext.Consumer>
      {({theme: {menuTheme}}) => {
        return (
          <Menu theme={menuTheme} mode="inline" defaultSelectedKeys={['1']}>
            {
              menusData.map((item) => {
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
                              // replace={path === location.pathname}
                            >{item.title} </Link>
                          </Menu.Item>

                        ))
                      }
                    </SubMenu>
                  )
                }else {
                  return (
                    <Menu.Item key={item.path}>
                      <Link
                        to={item.path}
                        // replace={path === location.pathname}
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