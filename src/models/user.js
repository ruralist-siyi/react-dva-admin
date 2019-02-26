/**
 * @Description: 用户的model
 * @author siyi
 * @date 2019/2/123:49 PM
 * @contact dajiadoujiaowosiyi@163.com
 */

import {fromJS} from 'immutable';
import {routerRedux} from 'dva/router';

const initialState = fromJS({
  routesData: {}
});

export default {
  namespace: 'user',
  state: initialState,
  reducers: {
    setRoutesData(state, {payload: routesData}) {
      return state.set('routesData', routesData);
    },
  },
  effects: {
    /**
     * 登录，请求权限、字典数据
     * 判断是否是初始密码
     *
     * @param {*} { payload }
     * @param {*} { call, put, select, take }
     */* login({payload}, {call, put, select, take}) {
      const {body} = payload;
      try {
        // const { data } = yield call(user.login, body, { checkToken: false });
        // 存储用户信息
        yield put({type: 'setUserInfo', payload: data});
        // 存储token, token
        sessionStorage.setItem('token', data.token);
      } catch (error) {
        throw error;
      }
    },
  },
  subscriptions: {},
}