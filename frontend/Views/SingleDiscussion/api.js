import axios from 'axios';

import Base32 from '../../util/base32.js'

import env from '../../env.js';
const keccak256 = require('keccak256');
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
  return axios.put(env.url+`/api/discussion/toggleFavorite/${discussion_id}`);
};

export const postOpinionApi = (opinion) => {
  return axios.post(env.url+'/api/opinion/newOpinion', opinion);
};

export const deletePostApi = (discussionSlug) => {
  return axios.delete(env.url+`/api/discussion/deleteDiscussion/${discussionSlug}`);
};

export const deleteOpinionApi = (opinionId) => {
  return axios.delete(env.url+`/api/opinion/deleteOpinion/${opinionId}`);
};
