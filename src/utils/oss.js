/**
 * @Description: oss
 * @author dajiadoujiaowosiyi@163.com
 * @date 2019-04-29 14:54
*/
const OSS_URL = 'http://47.97.114.40:8040/oss/querySTSInfo';
const tenantId = '0001';

/**
 * 获取oss配置
 */
export async function getOSSConfig() {
  await fetch(OSS_URL, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({
      tenantId,
      terminalType: '2',
      serialId: Math.random().toString(36).substr(2) + new Date().getTime(),
      token: localStorage.getItem('token')
    })
  }).then((response) => {
    return response.json();
  }).then((res) => {
    if (res.code === '000000') {
      const {expiration, sysTime} = res.data;
      const expire = new Date().getTime() + new Date(expiration).getTime() - new Date(sysTime).getTime() - 60 * 1000;
      localStorage.setItem("ossExpiration", expire);
      localStorage.setItem("ossConfig", JSON.stringify(res.data));
    } else {
      console.error(res.message || 'sts请求错误');
    }
  }).catch((error) => {
    console.log(error);
  })
}

/**
 * 获取 oss 实例
 * @returns oss实例
 */
export async function getOSSInstance() {
  if(!localStorage.getItem("ossExpiration")) return;
  const ossExpiration = localStorage.getItem("ossExpiration");
  if (new Date().getTime() > ossExpiration) {
    await getOSSConfig();
  }
  if(!localStorage.getItem("ossConfig")) return;
  const {accessKeyId, accessKeySecret, bucketName, endPoint, securityToken} = JSON.parse(localStorage.getItem('ossConfig'));
  return new OSS({
    endpoint: endPoint,
    accessKeyId,
    accessKeySecret,
    bucket: bucketName,
    stsToken: securityToken,
  });
}

/**
 * 上传方法
 * @param name
 * @param file
 * @param progress
 * @param callback
 */
export function upload({name, file, progress = null, callback}) {
  const instance = getOSSInstance();
  const pathName = getOSSFileName(name);
  instance.then((client) => {
    client.multipartUpload(
      pathName,
      file,
      {
        parallel: 4,
        progress: progress
      }
    ).then((res) => {
      callback && callback(res);
    }).catch((err) => {
      console.error(err);
    });
  })
}

/**
 * 根据图片oss返回的url，获取完整的url
 * @param url
 * @param options
 * @returns 完整的url
 */
export async function getUrl(url, options = {expires: 3600, process: 'image/resize,m_fixed,w_100,h_100'}) {
  const imageType = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'];
  const ifImage = imageType.indexOf(url.substr(url.lastIndexOf('.') + 1)) !== -1;
  if(!ifImage) {
    options = {expires: 3600};
  }
  const instance = getOSSInstance();
  return await instance.then((client) => {
    return client.signatureUrl(url, options)
  });
}

/**
 * 获取oss路径name
 * @param name 文件name
 * @returns {string}
 */
export function getOSSFileName(name) {
  const nowDate = new Date();
  return nowDate.getFullYear() + '-' + nowDate.getMonth() + 1 + '-' + nowDate.getDate() + '/' + nowDate.getTime() + '-' + name
}

/**
 * 根据oss sts的路径从oss下载文件
 * @param name
 */
export async function download(name) {
  const instance = getOSSInstance();
  instance.then((client) => {
    client.get(name).then((res) => {
      let eleLink = document.createElement('a');
      eleLink.download = name;
      eleLink.style.display = 'none';
      eleLink.href = window.URL.createObjectURL(new Blob([res.content.buffer]));
      document.body.appendChild(eleLink);
      eleLink.click();
      document.body.removeChild(eleLink);
    })
  });
}

/**
 * 从oss上获取file
 * @param name
 * @returns file
 */
export async function getFile(name) {
  const instance = getOSSInstance();
  return await instance.then((client) => {
    return client.get(name).then((file) => {
      return file;
    })
  });
}

/**
 * oss删除文件：支持批量与单个都行
 * @param name string: 单个； array: 批量；
 * @returns {Promise<*>}
 */
export async function deleteFile(name) {
  const instance = getOSSInstance();
  if(Array.isArray(name) && name.length > 0) {
    return await instance.then((client) => {
      return client.deleteMulti(name, {
        quiet: true
      });
    });
  }else {
    console.log(name);
    return await instance.then((client) => {
      return client.delete(name);
    });
  }
}



