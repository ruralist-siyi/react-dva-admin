/**
 * @Description: 将全局默认共享的数据层
 * @author siyi
 * @date 2019/1/293:32 PM
 * @contact dajiadoujiaowosiyi@163.com
 */

import {fromJS} from 'immutable';
import Menus from "../constants/menus";
import resources from "../constants/resources";

const menusOperate = new Menus();

const initialState = fromJS({
  menuCollapsed: false,
  routesData: null,
  menusData: null,
  formatMenusData: null,
  authorizedMenusData: [],
  authorizedPathList: []
});

export default {
  namespace: 'global',
  state: initialState,
  reducers: {
    setRoutesData(state, {payload: routesData}) {
      return state.set('routesData', fromJS(routesData || null));
    },
    toggleMenuCollapsed(state) {
      return state.set('menuCollapsed', !state.get('menuCollapsed'));
    },
    setMenusData(state, {payload}) {
      return state.set('menusData', fromJS(payload || null));
    },
    setFormatMenusData(state, {payload}) {
      return state.set('formatMenusData', fromJS(payload || null));
    },
    setAuthorizedMenusData(state, {payload}) {
      return state.set('authorizedMenusData', fromJS(payload || null));
    },
    setAuthorizedPathList(state, {payload}) {
      return state.set('authorizedPathList', fromJS(payload || null));
    },
    // setAuthorizedRoutesData(state, {payload}) {
    //   const resourcePathList = payload;
    //   let routesData = state.get('routesData').toJS();
    //   for(let path in routesData) {
    //     if(resourcePathList.includes(path)) {
    //       routesData[path].authority = true;
    //     }
    //   }
    //   return state.set('routesData', fromJS(routesData || null));
    // },
  },
  effects: {
    /**
     * app初始化数据
     * @param payload
     * @param call
     * @param put
     * @param select
     * @returns {IterableIterator<*>}
     */
    * startApp({payload}, {call, put, select}) {
      // 将路由配置数据存入store
      yield put({type: 'setRoutesData', payload});
      // 存储菜单数据
      yield put({type: 'setMenusData', payload: menusOperate.getAllMenusData()});
      // 存储格式化后的菜单数据
      yield put({type: 'setFormatMenusData', payload: menusOperate.getFlatMenusConfig()});
    },

    /**
     *  登录后获取到权限，设置授权后的数据
     * @param payload
     * @param call
     * @param put
     * @param select
     * @returns {IterableIterator<*>}
     */
    * setAuthority({payload}, {call, put, select}) {
      const resourceList = yield select(state => state.user.get('resourceList'));
      const authorizedResources = resourceList.toJS().map((item) => {
        if (resources[item]) {
          return resources[item];
        }
      });
      const resourcePathList = authorizedResources.filter((item) => item);
      yield put({type: 'setAuthorizedPathList', payload: resourcePathList});
      // 存储授权菜单
      yield put({type: 'setAuthorizedMenusData', payload: menusOperate.getAuthorizedMenuData(resourcePathList)});
    },
  },
  subscriptions: {},
}
