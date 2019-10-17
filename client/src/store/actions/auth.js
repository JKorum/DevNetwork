import axios from 'axios'
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
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
      console.log(
        `loadUserGenerator failed to load user. reason: ${err.message}`
      )
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

// logout & clear user profile
export const logoutUserGenerator = () => {
  return async dispatch => {
    // logout user on client side first
    dispatch({
      type: LOGOUT
    })
    // then hit logout endpoint
    try {
      const res = await axios.patch('api/users/logout')
      if (res.status === 204) console.log('server responded with 204 (logout)')
    } catch (err) {
      if (err.response && err.response.status === 500) {
        console.log('server responded with 500 (logout)')
      } else {
        console.log('no response from server (logout)')
        console.log(err.message)
      }
    }
  }
}
