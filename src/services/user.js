
import { createApiRequest } from '../utils/request';

export default {
  login: createApiRequest('/auth/user/login'),
};