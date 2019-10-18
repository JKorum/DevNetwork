import {
  GET_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  ADD_EXPERIENCE,
  ADD_EXPERIENCE_ERROR
} from '../actions/types'

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {}
}

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
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null, // should it also clear `profiles` & `errors`?
        repos: [],
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
    case ADD_EXPERIENCE_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    default:
      return state
  }
}
