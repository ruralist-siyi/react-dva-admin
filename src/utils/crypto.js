import AES from 'crypto-js/aes';
import utf8 from 'crypto-js/enc-utf8';
import md5 from 'crypto-js/md5';

/**
 * md5加密方法
 * @param data 被加密的数据
 * @returns {*}
 */
export function encryptMD5(data) {
  return md5(data);
}

/**
 *  AES加密方法
 * @param data 被加密的数据
 * @param secretKey 密钥
 * @returns {string}
 */
export function encryptAES(data, secretKey) {
  return AES.encrypt(data, secretKey).toString();
}

/**
 * AES解密方法
 * @param cryptoStr 加密后需要解密的数据
 * @param secretKey 密钥
 * @returns {string}
 */
export function decryptAES(cryptoStr, secretKey) {
  return AES.decrypt(cryptoStr, secretKey).toString(utf8);
}