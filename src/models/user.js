/**
 * @Description: 用户的model
 * @author siyi
 * @date 2019/2/123:49 PM
 * @contact dajiadoujiaowosiyi@163.com
 */

import {fromJS} from 'immutable';
import user from '../services/user';
import {routerRedux} from 'dva/router';
import {encryptAES} from '../utils/crypto';

const initialState = fromJS({
  userInfo: null,
  resourceList: []
});

export default {
  namespace: 'user',
  state: initialState,
  reducers: {
    setUserInfo(state, {payload}) {
      return state.set('userInfo', fromJS(payload || null));
    },
    setResourceList(state, {payload}) {
      return state.set('resourceList', fromJS(payload || null));
    },
  },
  effects: {
    /**
     * 登录，请求权限、字典数据
     *
     * @param {*} { payload }
     * @param {*} { call, put}
     */
    * login({payload}, {call, put}) {
      const {body} = payload;
      try {
        const { data } = yield call(user.login, body, { checkToken: false });
        const resourceList = data.resourceList || [];
        delete data.resourceList;
        // 存储用户信息
        yield put({type: 'setUserInfo', payload: data});
        // 存储权限资源信息
        yield put({type: 'setResourceList', payload: resourceList});
        yield put({type: 'global/setAuthority'});
        // 存储、加密token
        sessionStorage.setItem('token', encryptAES(data.token,'token'));
        // 跳转到首页
        yield put(routerRedux.push('/'));
      } catch (error) {
        throw error;
      }
    },
  },
  subscriptions: {},
}