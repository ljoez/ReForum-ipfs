import {
  START_FETCHING_FORUMS,
  STOP_FETCHING_FORUMS,
  FETCHING_FORUMS_SUCCESS,
  FETCHING_FORUMS_FAILURE,
  UPDATECURRENTFORUM,
  START_FETCHING_USER,
  FETCHING_USER_SUCCESS,
  FETCHING_USER_FAILURE,
  START_FETCHING_NETWORK_STATUS,
  STOP_FETCHING_NETWORK_STATUS,
  FETCHING_NETWORK_STATUS_FAILURE,
  FETCHING_NETWORK_STATUS_SUCCESS,
} from './constants';

const initialState = {
  fetchingForums: false,
  forums: null,
  currentForum: 'general',
  error: false,
};

/**
 * reducer for top level app state
 */
export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case START_FETCHING_FORUMS:
      return Object.assign({}, state, {
        fetchingForums: true,
      });;

    case STOP_FETCHING_FORUMS:
      return Object.assign({}, state, {
        fetchingForums: false,
      });;

    case FETCHING_FORUMS_SUCCESS:
      return Object.assign({}, state, {
        forums: action.payload,
        fetchingForums: false,
        error: false,
      });

    case FETCHING_FORUMS_FAILURE:
      return Object.assign({}, state, {
        fetchingForums: false,
        error: 'Unable to fetch forums',
      });

    case UPDATECURRENTFORUM:
      return Object.assign({}, state, {
        currentForum: action.payload,
      });

    default:
      return state;
  }
};



const initialNetworkStatusState = {
  fetchingNetworkStatus: false,
  networkStatus: null,
  error: false,
};

/**
 * reducer for top level app state
 */
export const networkStatusReducer = (state = initialNetworkStatusState, action) => {
  switch (action.type) {
    case START_FETCHING_NETWORK_STATUS:
      return Object.assign({}, state, {
        fetchingNetworkStatus: true,
      });;

    case STOP_FETCHING_NETWORK_STATUS:
      return Object.assign({}, state, {
        fetchingNetworkStatus: false,
      });;

    case FETCHING_NETWORK_STATUS_SUCCESS:
      return Object.assign({}, state, {
        networkStatus: true,
        fetchingNetworkStatus: false,
        error: false,
      });

    case FETCHING_NETWORK_STATUS_FAILURE:
      return Object.assign({}, state, {
        networkStatus:false,
        fetchingNetworkStatus: false,
        error: 'Unable to fetch networkStatus',
      });
    default:
      return state;
  }
};
/**
 * reducer for user
 */
const initialUserState = {
  fetchingUser: true,
  authenticated: false,
  error: null,
  _id: null,
  name: null,
  email: null,
  username: null,
  avatarBase64: null,
  avatarUrl: null,
  githubUrl: null,
  githubLocation: null,
  githubBio: null,
  role: null,
};

export const userReducer = (state = initialUserState, action) => {
  switch (action.type) {
    case START_FETCHING_USER:
      return Object.assign({}, state, {
        fetchUser: true,
      });

    case FETCHING_USER_SUCCESS:
      const {
        _id,
        name,
        username,
        avatarBase64,
        avatarUrl,
        email,
        githubBio,
        githubUrl,
        githubLocation,
        role,
      } = action.payload;

      return Object.assign({}, state), {
        fetchingUser: false,
        authenticated: true,
        error: null,
        _id,
        name,
        username,
        avatarBase64,
        avatarUrl,
        email,
        githubBio,
        githubUrl,
        githubLocation,
        role,
      };

    case FETCHING_USER_FAILURE:
      return Object.assign({}, initialUserState, {
        fetchingUser: false,
        error: 'Unable to fetch user!',
      });

    default:
      return state;
  }
};
