import {
  GET_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  ADD_EXPERIENCE,
  ADD_EXPERIENCE_ERROR,
  ADD_EDUCATION,
  ADD_EDUCATION_ERROR,
  DELETE_EDUCATION,
  DELETE_EDUCATION_ERROR,
  DELETE_EXPERIENCE,
  DELETE_EXPERIENCE_ERROR,
  GET_PROFILES,
  GET_REPOS,
  CLEAR_PROFILES
} from '../actions/types'

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {}
}

// maybe refactor -> compute new state using deep copying not shallow
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PROFILE:
      return {
        ...state,
        profile: action.payload,
        loading: false
      }
    case PROFILE_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case GET_PROFILES:
      return {
        ...state,
        profiles: action.payload,
        loading: false
      }
    case GET_REPOS:
      return {
        ...state,
        loading: false,
        repos: action.payload
      }
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        repos: [],
        loading: false
      }
    case CLEAR_PROFILES:
      return {
        ...state,
        profiles: [],
        error: {},
        loading: false
      }
    case ADD_EXPERIENCE:
      return {
        ...state,
        loading: false,
        profile: {
          ...state.profile,
          experience: action.payload,
          user: { ...state.profile.user },
          skills: [...state.profile.skills],
          education: [...state.profile.education]
        }
      }
    case DELETE_EXPERIENCE:
    case DELETE_EDUCATION:
      return {
        ...state,
        loading: false
      }
    case ADD_EDUCATION:
      return {
        ...state,
        loading: false,
        profile: {
          ...state.profile,
          education: action.payload,
          user: { ...state.profile.user },
          skills: [...state.profile.skills],
          experience: [...state.profile.experience]
        }
      }
    case ADD_EXPERIENCE_ERROR:
    case ADD_EDUCATION_ERROR:
    case DELETE_EDUCATION_ERROR:
    case DELETE_EXPERIENCE_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload // where this data is used?
      }
    default:
      return state
  }
}
