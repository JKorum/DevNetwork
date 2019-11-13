import { combineReducers } from 'redux'
import alertReducer from './alert'
import registerReducer from './auth'
import profileReducer from './profile'
import postReducer from './post'
import recoveryReducer from './recovery'

export default combineReducers({
  alerts: alertReducer,
  authentication: registerReducer,
  profile: profileReducer,
  post: postReducer,
  recovery: recoveryReducer
})
