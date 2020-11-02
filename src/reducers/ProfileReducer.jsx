import {
    DATA_LOADED,
    DATA_FAILED,
    PROFILE_LOADED,
  } from "../ProfileType";

  export default (
    state = {
      loadingError: false,
      profiles: [],
      profileInfo: {}
    },
    action
  ) => {
    switch (action.type) {
      case DATA_LOADED:
        return { 
          ...state,
          profiles: action.profiles,
          loadingError: false
        };
        case PROFILE_LOADED:
        return {
          ...state,
          profileInfo: action.profileInfo,
          loadingError: false
        };
      case DATA_FAILED:
        return {
          ...state,
          loadingError: true
        };
      default:
        return state;
    }
  };