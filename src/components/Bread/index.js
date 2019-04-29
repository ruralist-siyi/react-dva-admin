import React from 'react';
import {Breadcrumb, Icon} from 'antd';
import styles from './Bread.module.less';

const Bread = React.memo(({formatMenusData, location, routesData}) => {
  routesData = routesData.toJS();
  const {pathname} = location;
  return (
    <Breadcrumb className={styles['bread-wrap']}>
      <Breadcrumb.Item>
        {routesData && routesData[pathname] ? routesData[pathname].title : null}
      </Breadcrumb.Item>
    </Breadcrumb>
  )
});

export default Bread;
