import axios from 'axios'
import { setAlert } from './alert'
import setAuthHeader from '../../utils/setAuthHeader'

import {
  GET_PROFILE,
  PROFILE_ERROR,
  ADD_EXPERIENCE,
  ADD_EXPERIENCE_ERROR,
  ADD_EDUCATION_ERROR,
  ADD_EDUCATION
} from '../actions/types'

// get current user profile
export const fetchProfileGenerator = () => {
  // if token in `localStorage` -> set `Authorization: Bearer <token>` for all requests
  if (localStorage.token) {
    setAuthHeader(localStorage.token)
  }
  return async dispatch => {
    try {
      const res = await axios.get('api/profiles/me')
      if (res.status === 200) {
        dispatch({
          type: GET_PROFILE,
          payload: res.data
        })
      }
    } catch (err) {
      // integrate Alerts?
      // server responded with no 2** status
      if (err.response) {
        const { status } = err.response
        // user has not created profile yet
        if (status === 404) {
          dispatch({
            type: GET_PROFILE,
            payload: null
          })
        }
        if (status === 500 || status === 401) {
          const { errors } = err.response.data
          dispatch({
            type: PROFILE_ERROR,
            payload: { msg: errors[0].msg }
          })
        }
      } else {
        // no response is received
        console.log(err.message)
        dispatch({
          type: PROFILE_ERROR,
          payload: { msg: 'something went wrong' }
        })
      }
    }
  }
}

// in-> form data & history obj
export const createProfileGenerator = (data, history) => {
  const config = {
    url: '/api/profiles',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data
  }
  return async dispatch => {
    try {
      const res = await axios(config)
      if (res.status === 201) {
        dispatch({
          type: GET_PROFILE,
          payload: res.data
        })
        dispatch(setAlert('profile created', 'success'))
        history.push('/dashboard')
      }
    } catch (err) {
      // server responded with no 2** status
      if (err.response) {
        const { status } = err.response
        if (status === 400 || status === 422 || status === 500) {
          const { errors } = err.response.data
          errors &&
            errors.forEach(err => {
              dispatch(setAlert(`${err.param} ${err.msg}`, 'danger'))
            })
        }
        dispatch({
          type: PROFILE_ERROR
        })
      } else {
        // no response is received
        console.log(err.message)
        dispatch(setAlert('something went wrong', 'danger'))
        dispatch({
          type: PROFILE_ERROR
        })
      }
    }
  }
}

// in-> form data
export const editProfileGenerator = data => {
  const config = {
    url: '/api/profiles/me/update',
    method: 'patch',
    headers: { 'Content-Type': 'application/json' },
    data
  }
  return async dispatch => {
    try {
      const res = await axios(config)
      if (res.status === 200) {
        dispatch({
          type: GET_PROFILE,
          payload: res.data
        })
        dispatch(setAlert('profile updated', 'success'))
      }
    } catch (err) {
      // server responded with no 2** status
      if (err.response) {
        const { status } = err.response
        if (
          status === 401 ||
          status === 422 ||
          status === 500 ||
          status === 404
        ) {
          const { errors } = err.response.data
          errors &&
            errors.forEach(err => {
              dispatch(setAlert(`${err.param} ${err.msg}`, 'danger'))
            })
        }
        dispatch({
          type: PROFILE_ERROR
        })
      } else {
        // no response is received
        console.log(err.message)
        dispatch(setAlert('something went wrong', 'danger'))
        dispatch({
          type: PROFILE_ERROR
        })
      }
    }
  }
}

export const addExperienceGenerator = (data, history) => {
  const config = {
    url: 'api/profiles/experience',
    method: 'patch',
    headers: { 'Content-Type': 'application/json' },
    data
  }
  return async dispatch => {
    try {
      const res = await axios(config)
      if (res.status === 200) {
        dispatch({
          type: ADD_EXPERIENCE,
          payload: res.data
        })
        dispatch(setAlert('experience added', 'success'))
        history.push('/dashboard')
      }
    } catch (err) {
      // server responded with no 2** status
      if (err.response) {
        const { status } = err.response
        const { errors } = err.response.data
        if (status === 422) {
          errors.forEach(err =>
            dispatch(setAlert(`${err.param} ${err.msg}`, 'danger'))
          )
        } else if (status === 404 || status === 500) {
          errors.forEach(err => dispatch(setAlert(err.msg, 'danger')))
        }
        dispatch({
          type: ADD_EXPERIENCE_ERROR
        })
      } else {
        // no response is received
        console.log(err.message)
        dispatch(setAlert('something went wrong', 'danger'))
        dispatch({
          type: ADD_EXPERIENCE_ERROR
        })
      }
    }
  }
}

export const addEducationGenerator = (data, history) => {
  const config = {
    url: 'api/profiles/education',
    method: 'patch',
    headers: { 'Content-Type': 'application/json' },
    data
  }
  return async dispatch => {
    try {
      const res = await axios(config)
      if (res.status === 200) {
        dispatch({
          type: ADD_EDUCATION,
          payload: res.data
        })
        dispatch(setAlert('education added', 'success'))
        history.push('/dashboard')
      }
    } catch (err) {
      // server responded with no 2** status
      if (err.response) {
        const { status } = err.response
        const { errors } = err.response.data
        if (status === 422) {
          errors.forEach(err =>
            dispatch(setAlert(`${err.param} ${err.msg}`, 'danger'))
          )
        } else if (status === 404 || status === 500) {
          errors.forEach(err => dispatch(setAlert(err.msg, 'danger')))
        }
        dispatch({
          type: ADD_EDUCATION_ERROR
        })
      } else {
        // no response is received
        console.log(err.message)
        dispatch(setAlert('something went wrong', 'danger'))
        dispatch({
          type: ADD_EDUCATION_ERROR
        })
      }
    }
  }
}
