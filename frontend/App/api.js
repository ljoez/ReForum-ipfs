import axios from 'axios';
import Base32 from '../util/base32.js'
import env from '../env.js'
const keccak256 = require('keccak256');
import storage from './storage.js';

export const fetchForums = (forum_id) => {
  return axios.get(env.url+'/api/forum');
};

export const fetchUser = () => {
  var accessString = storage.get('token');
  return axios.get(env.url+'/api/user/getUser',{
    headers: { Authorization: `bearer ${accessString}` },
  });
};

export const fetchNetworkStatus = () => {
  return axios.get(env.url+'/api/getNetworkStatus',{timeout:2000});
};
export const fetchForumsIpfs = () => {
  
  let forumTable = JSON.stringify({url:"/api/forum"});
  let hashCode = keccak256(forumTable).toString('hex');
  return axios.get(hashCode+".json");
};