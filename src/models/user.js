/**
 * @Description: 用户的model
 * @author siyi
 * @date 2019/2/123:49 PM
 * @contact dajiadoujiaowosiyi@163.com
 */

import {fromJS} from 'immutable';
import user from '../services/user';
import {routerRedux} from 'dva/router';

const initialState = fromJS({
  userInfo: {},
  routesData: {}
});

export default {
  namespace: 'user',
  state: initialState,
  reducers: {
    setUserInfo(state, {payload}) {
      return state.set('userInfo', payload);
    },
    setResourceList(state, {payload}) {
      return state.set('resourceList', payload);
    },
    setRoutesData(state, {payload}) {
      return state.set('routesData', payload);
    },
  },
  effects: {
    /**
     * 登录，请求权限、字典数据
     * 判断是否是初始密码
     *
     * @param {*} { payload }
     * @param {*} { call, put, select, take }
     */
    * login({payload}, {call, put, select, take}) {
      const {body} = payload;
      try {
        const { data } = yield call(user.login, body, { checkToken: false });
        const resourceList = data.resourceList || [];
        delete data.resourceList;
        // 存储用户信息
        yield put({type: 'setUserInfo', payload: data});
        // 存储权限资源信息
        yield put({type: 'setResourceList', payload: resourceList});
        // 存储token, token
        sessionStorage.setItem('token', data.token);

        // 跳转到首页
        yield put(routerRedux.push('/home'));
      } catch (error) {
        throw error;
      }
    },
  },
  subscriptions: {},
}