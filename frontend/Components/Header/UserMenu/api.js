import axios from 'axios';
import env from '../../../env.js';

export const signIn = (data) => {
  return axios.post(env.url+'/api/user/signIn', data);
};

export const signout = () => {
  return axios.get(env.url+'/api/user/signout');
};
