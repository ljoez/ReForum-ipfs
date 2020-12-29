import axios from 'axios';
import env from '../../../env.js';

export const signIn = (user) => {
  return axios.post(env.url+'/api/user/signIn', user);
};
