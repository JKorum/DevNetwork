import { combineReducers } from 'redux'
import alertReducer from './alert'
import registerReducer from './auth'
import profileReducer from './profile'

export default combineReducers({
  alerts: alertReducer,
  authentication: registerReducer,
  profile: profileReducer
})
