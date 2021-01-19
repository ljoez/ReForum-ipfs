import axios from 'axios';

import Base32 from '../../util/base32.js'

import env from '../../env.js';
const keccak256 = require('keccak256');
import storage from './../../App/storage.js';
/**
 * single discussion apis
 */
export const fetchSingleDiscussion = (discussion_slug) => {
  return axios.get(env.url+`/api/discussion/${discussion_slug}`);
};

export const fetchSingleDiscussionIpfs = (discussion_slug) => {
  let forumTable = JSON.stringify({url:`/api/discussion/${discussion_slug}`});
  let hashCode = keccak256(forumTable).toString('hex');
  return axios.get(hashCode+".json");
};

export const toggleFavoriteApi = (discussion_id) => {
  var accessString = storage.get('token');
  return axios.get(env.url+`/api/discussion/toggleFavorite/${discussion_id}`,{
    headers: { Authorization: `bearer ${accessString}` },
  });
};

export const postOpinionApi = (opinion) => {
  var accessString = storage.get('token');
  return axios.post(env.url+'/api/opinion/newOpinion', opinion,{
    headers: { Authorization: `bearer ${accessString}` },
  });
};

export const deletePostApi = (discussionSlug) => {
  var accessString = storage.get('token');
  return axios.delete(env.url+`/api/discussion/deleteDiscussion/${discussionSlug}`,{
    headers: { Authorization: `bearer ${accessString}` },
  });
};

export const deleteOpinionApi = (opinionId) => {
  var accessString = storage.get('token');
  return axios.delete(env.url+`/api/opinion/deleteOpinion/${opinionId}`,{
    headers: { Authorization: `bearer ${accessString}` },
  });
};
