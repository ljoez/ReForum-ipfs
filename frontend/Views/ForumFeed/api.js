import axios from 'axios';
import Base32 from '../../util/base32.js'

import env from '../../env.js'
/**
 * feed apis
 */
export const fetchDiscussions = (forum_id, sortingMethod) => {
  return axios.get(env.url+`/api/forum/${forum_id}/discussions?sorting_method=${sortingMethod}`);
};
export const fetchDiscussionsIpfs = (forum_id,sortingMethod) => {
  
  let forumTable = JSON.stringify({url:`/api/forum/${forum_id}/discussions?sorting_method=${sortingMethod}`});
  let base32Code = Base32.encode(forumTable);
  return axios.get(base32Code+".json");
};

export const fetchPinnedDiscussions = (forum_id) => {
  return axios.get(env.url+`/api/forum/${forum_id}/pinned_discussions`);
};
export const fetchPinnedDiscussionsIpfs = (forum_id) => {
  let forumTable = JSON.stringify({url:`/api/forum/${forum_id}/pinned_discussions`});
  let base32Code = Base32.encode(forumTable);
  return axios.get(base32Code+".json");
};
