/**
 * 自定义自定义错误类型对象
 */

/**
 * 异常对象，参数加了name
 *
 * @class Exception
 * @extends {Error}
 */
export class Exception extends Error {
  constructor(name = '', message = '') {
    super(message);
    this.name = name || this.constructor.name;
    // 在error对象上添加合理的stack属性 通过this.constructor传入constructorOpt参数。在自定义Error类中使用captureStackTrace时，推荐采用该方法。
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

/**
 * http异常对象
 *
 * @class HttpException
 * @extends {Exception}
 */
export class HttpException extends Exception {
  static codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
  };

  response;

  constructor(response) {
    super();
    this.name = `网络请求错误 ${response.status}`;
    this.message = HttpException.codeMessage[response.status] || response.statusText;
    this.response = response;
  }
}


/**
 * 请求异常对象，后端报错的信息
 *
 * @class RequestException
 * @extends {Exception}
 */
export class RequestException extends Exception {
  code;

  constructor(code, message) {
    super();
    this.name = `请求错误 ${code}`;
    this.message = message;
    this.code = code;
  }
}
