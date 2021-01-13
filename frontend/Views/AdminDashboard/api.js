import axios from 'axios';
import env from '../../env.js'

export const getAdminDashboardInfoAPI = () => {
  return (axios.get(env.url+'/api/admin/admin_dashboard_info'),{ withCredentials: true });
};

export const createForumAPI = (forum_obj) => {
  return (axios.post(env.url+'/api/admin/create_forum', forum_obj),{ withCredentials: true });
};

export const deleteForumAPI = (forum_id) => {
  return (axios.post(env.url+'/api/admin/delete_forum', { forum_id }),{ withCredentials: true });
};
