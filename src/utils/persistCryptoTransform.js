
import { createTransform } from 'redux-persist';
import { fromJS } from 'immutable';

import { encryptAES, decryptAES } from './crypto';

/**
 * persist加密存储
 *
 * @export
 * @param {*} config
 * @returns
 */
export function createPersistCryptoTransform(config) {
  return createTransform(
    (inboundState, key) => {
      return encryptAES(JSON.stringify(inboundState.toJS()), config.secretKey);
    },
    (outboundState, key) => {
      let state = JSON.parse(decryptAES(outboundState, config.secretKey));
      return fromJS(state);
    },
    config,
  );
}