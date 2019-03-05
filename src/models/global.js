/**
 * @Description: 将全局默认共享的数据层
 * @author siyi
 * @date 2019/1/293:32 PM
 * @contact dajiadoujiaowosiyi@163.com
*/

import {fromJS} from 'immutable';

const initialState = fromJS({
  menuCollapsed: false,
  routesData: {}
});

export default {
  namespace: 'global',
  state: initialState,
  reducers: {
    setRoutesData(state, {payload: routesData}) {
      return state.set('routesData', routesData);
    },
    toggleMenuCollapsed(state) {
      return state.set('menuCollapsed', !state.get('menuCollapsed'));
    }
  },
  effects: {
    /**
     * app 启动初始化
     *
     * @param {*} { payload }
     * @param {*} { call, put, select }
     */
      * startApp({payload}, {call, put, select}) {
      // 将路由配置数据存入store
      yield put({type: 'setRoutesData', payload});
    }
  },
  subscriptions: {},
}