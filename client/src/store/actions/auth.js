import axios from 'axios'
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
  RECOVERY_OK,
  RECOVERY_DEFAULT
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
      console.log('auth error:', err)
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
        dispatch(setAlert('Registered', 'success'))
      }
    } catch (err) {
      // server responded with no 2** status
      if (err.response) {
        console.log('register error:', err)
        dispatch(setAlert('register failed', 'danger'))

        // const { status } = err.response
        // if (status === 400 || status === 422 || status === 500) {
        //   const { errors } = err.response.data
        //   errors &&
        //     errors.forEach(err => {
        //       dispatch(setAlert(err.msg, 'danger'))
        //     })
        // }
        dispatch({
          type: REGISTER_FAIL
        })
      } else {
        // no response is received
        console.log('register error:', err)
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
        console.log('login error:', err)
        dispatch(setAlert('login failed', 'danger'))

        // const { status } = err.response
        // if (status === 400 || status === 422) {
        //   const { errors } = err.response.data
        //   errors &&
        //     errors.forEach(err => {
        //       dispatch(setAlert(err.msg, 'danger'))
        //     })
        // }
        dispatch({
          type: LOGIN_FAIL
        })
      } else {
        // no response is received
        console.log('login error:', err)
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
    // clear user profile
    dispatch({
      type: CLEAR_PROFILE
    })
    // then hit logout endpoint
    try {
      await axios.patch('api/users/logout')
      // if (res.status === 204) console.log('server responded with 204 (logout)')
    } catch (err) {
      console.log('logout error:', err)

      // if (err.response) {
      //   console.log('logout error:', err)

      // } else {
      //   console.log('no response from server (logout)')
      //   console.log(err.message)
      // }
    }
  }
}

// logoutALL & clear user profile
export const logoutAllSessionsGenerator = () => {
  return async dispatch => {
    dispatch({
      type: LOGOUT
    })
    dispatch({
      type: CLEAR_PROFILE
    })

    try {
      await axios.patch('/api/users/logoutall')
      // if (res.status === 204) {
      //   console.log('logoutall: success')
      // }
    } catch (err) {
      console.log('logoutall error:', err)
      // if (err.response) {
      //   const { status } = err.response
      //   if (status === 500 || status === 401 || status === 400) {
      //     console.log(err.response.data)
      //   }
      // } else {
      //   // no response is received
      //   console.log(err.message)
      // }
    }
  }
}

/* recovery password actions */

export const sendRecoveryRequestGenerator = data => {
  const config = {
    url: '/api/users/recovery',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data
  }
  return async dispatch => {
    try {
      const res = await axios(config)
      if (res.status === 200) {
        dispatch(setAlert('check your email', 'success'))
      }
    } catch (err) {
      // server responded with no 2** status
      if (err.response) {
        console.log('recovery error:', err)
        dispatch(setAlert('recovery failed', 'danger'))
      } else {
        // no response is received
        console.log('recovery error:', err)
        dispatch(setAlert('something went wrong', 'danger'))
      }
    }
  }
}

export const sendNewPasswordGenerator = (token, data) => {
  const config = {
    url: '/api/users/recovery/confirm',
    method: 'patch',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    data
  }
  return async dispatch => {
    try {
      const res = await axios(config)
      if (res.status === 200) {
        dispatch(setAlert('password changed', 'success'))
        dispatch({
          type: RECOVERY_OK
        })
        setTimeout(() => {
          dispatch({
            type: RECOVERY_DEFAULT
          })
        }, 2000)
      }
    } catch (err) {
      // server responded with no 2** status
      if (err.response) {
        console.log('recovery error:', err)
        dispatch(setAlert('recovery failed', 'danger'))
      } else {
        // no response is received
        console.log('recovery error:', err)
        dispatch(setAlert('something went wrong', 'danger'))
      }
    }
  }
}

/* recovery password actions */
