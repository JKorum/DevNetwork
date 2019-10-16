import axios from 'axios'
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL
} from '../actions/types'
import { setAlert } from './alert'
import setAuthHeader from '../../utils/setAuthHeader'

export const loadUserGenerator = () => {
  // if token in `localStorage` -> set `Authorization: Bearer <token>` for all requests
  if (localStorage.token) {
    setAuthHeader(localStorage.token)
  }
  return async dispatch => {
    try {
      const res = await axios.get('/api/auth')
      if (res.status === 200) {
        dispatch({
          type: USER_LOADED,
          payload: res.data
        })
      }
    } catch (err) {
      console.log('loadUserGenerator failed to load user', err.message)
      dispatch({
        type: AUTH_ERROR
      })
    }
  }
}

// in-> { name, email, password }
export const registerGenerator = data => {
  const config = {
    url: '/api/users/register',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data
  }
  return async dispatch => {
    try {
      const res = await axios(config)
      if (res.status === 201) {
        dispatch({
          type: REGISTER_SUCCESS,
          payload: res.data
        })
        dispatch(loadUserGenerator())
      }
    } catch (err) {
      // server responded with no 2** status
      if (err.response) {
        const { status } = err.response
        if (status === 400 || status === 422 || status === 500) {
          const { errors } = err.response.data
          errors &&
            errors.forEach(err => {
              dispatch(setAlert(err.msg, 'danger'))
            })
        }
        dispatch({
          type: REGISTER_FAIL
        })
      } else {
        // no response is received
        console.log(err.message)
        dispatch(setAlert('something went wrong', 'danger'))
        dispatch({
          type: REGISTER_FAIL
        })
      }
    }
  }
}

// in-> { email, password }
export const loginUserGenerator = data => {
  const config = {
    url: '/api/users/login',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data
  }
  return async dispatch => {
    try {
      const res = await axios(config)
      if (res.status === 200) {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data
        })
        dispatch(loadUserGenerator())
      }
    } catch (err) {
      // server responded with no 2** status
      if (err.response) {
        const { status } = err.response
        if (status === 400 || status === 422) {
          const { errors } = err.response.data
          errors &&
            errors.forEach(err => {
              dispatch(setAlert(err.msg, 'danger'))
            })
        }
        dispatch({
          type: LOGIN_FAIL
        })
      } else {
        // no response is received
        console.log(err.message)
        dispatch(setAlert('something went wrong', 'danger'))
        dispatch({
          type: LOGIN_FAIL
        })
      }
    }
  }
}
