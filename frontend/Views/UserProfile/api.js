/**
 * user profile apis
 */

import axios from 'axios';
import env from '../../env.js';

export const fetchUserProfileApi = (userSlug) => {
  return axios.get(env.url+`/api/user/profile/${userSlug}`);
};
