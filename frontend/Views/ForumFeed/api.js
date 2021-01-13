import axios from 'axios';
import Base32 from '../../util/base32.js'

import env from '../../env.js'
const keccak256 = require('keccak256');
/**
 * feed apis
 */
export const fetchDiscussions = (forum_id,sortingMethod,pageNum) => {
  return axios.get(env.url+`/api/forum/${forum_id}/discussions?sorting_method=${sortingMethod}&pageNum=${pageNum}`,{ withCredentials: true });
};
export const fetchDiscussionsIpfs = (forum_id,sortingMethod,pageNum) => {
  
  let forumTable = JSON.stringify({url:`/api/forum/${forum_id}/discussions?sorting_method=${sortingMethod}&pageNum=${pageNum}`});
  let hashCode = keccak256(forumTable).toString('hex');
  return axios.get(hashCode+".json");
};

export const fetchPinnedDiscussions = (forum_id) => {
  return axios.get(env.url+`/api/forum/${forum_id}/pinned_discussions`);
};
export const fetchPinnedDiscussionsIpfs = (forum_id) => {
  let forumTable = JSON.stringify({url:`/api/forum/${forum_id}/pinned_discussions`});
  let hashCode = keccak256(forumTable).toString('hex');
  return axios.get(hashCode+".json");
};
