import axios from 'axios';
import env from '../../env.js';
import storage from './../../App/storage.js';

export const postDiscussionApi = (discussion) => {
  var accessString = storage.get('token');
  return axios.post(env.url+'/api/discussion/newDiscussion', discussion,{
    headers: { Authorization: `bearer ${accessString}` },
  });
};
