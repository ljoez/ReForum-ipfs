import axios from 'axios';
import env from '../../env.js'
import storage from '../../App/storage.js';

export const getAdminDashboardInfoAPI = () => {
  var accessString = storage.get('token');
  return (axios.get(env.url+'/api/admin/admin_dashboard_info',{
    headers: { Authorization: `bearer ${accessString}` },
  }));
};

export const createForumAPI = (forum_obj) => {
  var accessString = storage.get('token');
  return (axios.post(env.url+'/api/admin/create_forum', forum_obj,{
    headers: { Authorization: `bearer ${accessString}` },
  }));
};

export const deleteForumAPI = (forum_id) => {
  var accessString = storage.get('token');
  return (axios.post(env.url+'/api/admin/delete_forum', { forum_id },{
    headers: { Authorization: `bearer ${accessString}` },
  }));
};
