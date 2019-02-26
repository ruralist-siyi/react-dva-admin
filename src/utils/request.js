
import { routerRedux } from 'dva/router';
import FileSaver from 'file-saver';
import nanoid from 'nanoid';

import store from '../index';

import moment from 'moment';
import { isString } from './index';
import { HttpException, RequestException, Exception } from './exception';

import { trimReg } from '../constants/regexp';

const envURLs = {
  dev: 'http://192.168.3.122:8035',
  sit: 'http://47.98.239.167:8035',
  uat: 'http://192.168.3.122:8035',
};
// 接口请求的域名，两种选择方式，默认dev的url
// 生产模式下，才根据参数选择baseUrl
// export const baseURL = process.env.NODE_ENV === 'development'
//   ? envURLs.dev
//   : envURLs[process.env.PRODUCTION_ENV.toLowerCase()] || envURLs.dev;
// 完全根据参数选择baseURL
const baseURL = envURLs[process.env.PRODUCTION_ENV.toLowerCase()] || envURLs.dev;

/**
 * 基本 fetch 配置
 * 默认 post
 */
const fetchConfig = {
  method: 'post',
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
};

const defaultTimeout = 20000;
const defaultBody = {
  // 必传参数
  terminalType: '2',
  tenantId: '0001',
}



/**
 * 在请求的body转换成其他结构前，检查请求状态
 *
 * @param {*} response
 * @returns
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  if (response.status === 401) {
    // error = new RequestException('401', '登录超时，请重新登录');
    // store.dispatch(routerRedux.push('/index/login'));
    return response;
  }
  let error = new HttpException(response);
  throw error;
}

/**
 * request 函数的基本响应函数
 * 主要判断 code，并预先做处理
 * @param {Object} data 请求返回的数据
 * @returns 接口返回的数据
 */
function onResponse (data) {
  if (data.code === '000000') {
    return data;
  }
  const error = new RequestException(data.code, data.message);
  if (data.code === '011001') {
    error.message = 'token 不可用，请重新登录';
    store.dispatch(routerRedux.push('/index/login'));
  }
  if (data.code === '011002') {
    error.message = '用户没有权限';
  }
  throw error;
};


/**
 * JSON.stringify 的第二个参数
 *
 * @param {*} key
 * @param {*} value
 */
function defaultStringifyReplacer(key, value) {
  // key 处理

  // value处理
  // 将字符串trim
  if (isString(value) && trimReg.test(value)) {
    value = value.trim();
  }
  // 空字符串，作为undefined，没传值
  if (value === '') {
    value = undefined;
  }
  return value;
}

/**
 * 执行请求函数
 *
 * @param {*} reqOpts fetch请求参数
 * @param {*} [options={}] 其他参数
 * @returns
 */
function _request (reqOpts, options = {}) {
  const { method = 'post' } = reqOpts,
    { checkToken = true, timeout = defaultTimeout, stringifyReplacer = defaultStringifyReplacer } = options,
    token = sessionStorage.getItem('token') || null;
  // 完整的url
  let url = baseURL + reqOpts.url;

  if (checkToken && !token) {
    return Promise.reject(new RequestException('token 不存在', 'token 信息不存在，请重新登录'));
  }

  // 添加 token 参数
  let { body = null } = reqOpts,
    paramStr = '';
  body = {
    ...defaultBody,
    ...body,
    token,
    serialId: nanoid(),
  };

  // process.env.NODE_ENV === 'development' && console.log(`api: ${reqOpts.url} request body:`, body);

  // 根据请求方式，转换请求数据
  if (method.toLowerCase() === 'get') {
    paramStr = '?';
    for (const key in body) {
      paramStr += `${key}=${body[key]}&`;
    }
    paramStr = paramStr.slice(0, paramStr.length-1);
  }
  if (method.toLowerCase() === 'post') {
    body = JSON.stringify(body, stringifyReplacer);
  }

  // 超时promise
  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(
      () => reject(new RequestException('网络超时', '当前网络环境不稳定，请稍后再试。')),
      timeout,
    );
  })
  // 返回请求promise
  const fetchPromise = fetch(`${url}${paramStr}`, {
    ...fetchConfig,
    ...reqOpts,
    body,
  });

  return Promise.race([fetchPromise, timeoutPromise])
    .then(checkStatus);
}

// 创造的请求函数的缓存
const apiCaches = {};
// 根据url创建请求方法
export const createApiRequest = (url) => {
  if (apiCaches[url]) {
    return apiCaches[url];
  }
  apiCaches[url] = (body, options) => {
    return request({url, body,}, options);
  };
  return apiCaches[url];
};

export const createFileRequest = (url) => {
  if (apiCaches[url]) {
    return apiCaches[url];
  }
  apiCaches[url] = (body, options) => {
    return requestFile({url, body,}, options);
  };
  return apiCaches[url];
};

/**
 * 包装 fetch
 * @param {Object} reqOpts fetch 请求参数选项
 * @param {Object} options 自定义选项
 * @returns Promise 对象
 */
export function request (reqOpts, options = {}) {
  return _request(reqOpts, options).then(
    // 将返回的数据转换成 json 对象
    (res) => res.json()
  )
    .then(onResponse)
}

/**
 * 请求下载文件
 *
 * @export
 * @param {*} reqOpts
 * @param {*} [options={}]
 * @returns
 */
export function requestFile (reqOpts, options = {}) {
  // options.fileName 文件名，带后缀
  // 文件名
  let fileName = new Date().getTime()+'';
  if (options.fileName) {
    const [name, suffix] = fileName.split('.');
    fileName = `${name}${moment(new Date()).format('YYYY_MM_DD_hh_mm_ss')}.${suffix}`;
  }
  return _request(reqOpts, options).then(
    (res) => {
      const contentType = res.headers.get('content-type');
      // 从content-disposition获取文件名
      const disposition = res.headers.get('content-disposition');
      const matches = /filename=-([^"]*)/.exec(disposition);
      fileName = matches !== null && matches[1]? matches[1]: fileName;
      // 文件下载成功，会返回文件流；如果文件下载失败，会返回json数据
      if (contentType.match('application/octet-stream')) {
        return res.blob();
      } else {
        return res.json();
      }
    }
  ).then(
    (data) => {
      if (data instanceof Blob) {
        // 如果是blob数据
        FileSaver.saveAs(
          data,
          fileName
        );
      } else {
        throw new Exception('文件下载失败', data.message);
      }
      return data;
    }
  )
}


/**
 * 请求文件流数据
 *
 * @export
 * @param {*} reqOpts
 * @param {*} [options={}]
 * @returns
 */
export function requestFileStream (reqOpts, options = {}) {
  return _request(reqOpts, options).then(
    (res) => {
      const contentType = res.headers.get('content-type');
      if (contentType.match('application/octet-stream')) {
        return res.blob();
      } else {
        return res.json();
      }
    }
  ).then(
    (data) => {
      if (!(data instanceof Blob)) {
        throw new Exception('文件流下载失败', data.message);
      }
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve({
            blob: data,
            dataURL: event.target.result,
          });
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(data);
      });
    }
  )
}
