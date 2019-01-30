/**
 * @Description: 工具函数集合
 * @author siyi
 * @date 2019/1/293:23 PM
 * @contact dajiadoujiaowosiyi@163.com
 */

function isType(type) {
  return function (val) {
    if (Object.prototype.toString.call(val) === `[object ${type}]`) {
      return true;
    }
    return false;
  };
}

export const isString = isType('String');
export const isArray = isType('Array');
export const isFunction = isType('Function');
export const isObject = isType('Object');
export const isNumber = isType('Number');