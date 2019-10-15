import { combineReducers } from 'redux'
import alertReducer from './alert'
import registerReducer from './auth'

export default combineReducers({
  alerts: alertReducer,
  authentication: registerReducer
})
