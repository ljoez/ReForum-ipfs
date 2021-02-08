import axios from 'axios';
import env from '../../../env.js';
import storage from '../../../App/storage.js';

export const signIn = (data) => {
  return axios.post(env.url+'/api/user/signIn', data);
};

export const signout = () => {
  return axios.get(env.url+'/api/user/signout');
};

export const updateAvatar = (data) => {
  var accessString = storage.get('token');
  return axios.post(env.url+'/api/user/updateAvatar',data,{
    headers: { Authorization: `bearer ${accessString}` }
  });
};