import axios from 'axios';
import Base32 from '../util/base32.js'
import env from '../env.js'
export const fetchForums = (forum_id) => {
  return axios.get(env.url+'/api/forum');
};

export const fetchUser = () => {
  return axios.get(env.url+'/api/user/getUser');
};

export const fetchNetworkStatus = () => {
  return axios.get(env.url+'/api/getNetworkStatus',{timeout:2000});
};
export const fetchForumsIpfs = () => {
  
  let forumTable = JSON.stringify({url:"/api/forum"});
  let base32Code = Base32.encode(forumTable);
  return axios.get(base32Code+".json");
};