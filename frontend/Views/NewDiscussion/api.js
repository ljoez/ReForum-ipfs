import axios from 'axios';
import env from '../../env.js';

export const postDiscussionApi = (discussion) => {
  return axios.post(env.url+'/api/discussion/newDiscussion', discussion);
};
