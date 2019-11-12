import axios from 'axios'
import { setAlert } from './alert'
import setAuthHeader from '../../utils/setAuthHeader'

import {
  GET_PROFILE,
  PROFILE_ERROR,
  ADD_EXPERIENCE,
  ADD_EXPERIENCE_ERROR,
  ADD_EDUCATION_ERROR,
  ADD_EDUCATION,
  DELETE_EDUCATION,
  DELETE_EDUCATION_ERROR,
  DELETE_EXPERIENCE,
  DELETE_EXPERIENCE_ERROR,
  ACCOUNT_DELETED,
  CLEAR_PROFILE,
  GET_PROFILES,
  GET_REPOS,
  CLEAR_REPOS,
  UPLOADED_USER_UPDATE,
  CLEAR_PROFILES
} from '../actions/types'

// get all profiles
export const fetchAllProfilesGenerator = () => {
  return async dispatch => {
    try {
      // this maybe redundant
      dispatch({
        type: CLEAR_PROFILE
      })

      const res = await axios.get('/api/profiles')
      if (res.status === 200) {
        dispatch({
          type: GET_PROFILES,
          payload: res.data
        })
      }
    } catch (err) {
      // server responded with no 2** status
      if (err.response) {
        const { status } = err.response
        const { errors } = err.response.data
        // 404 -> can be if no profiles found
        if (status === 404) {
          dispatch({
            type: PROFILE_ERROR,
            payload: errors[0]
          })
        } else if (status === 500) {
          dispatch(setAlert('something went wrong', 'danger'))
          dispatch({
            type: PROFILE_ERROR,
            payload: { type: 'server error' }
          })
        } else {
          dispatch(setAlert('something went wrong', 'danger'))
          dispatch({
            type: PROFILE_ERROR,
            payload: { type: 'unknown error' }
          })
        }
      } else {
        // no response is received
        dispatch(setAlert('something went wrong', 'danger'))
        console.log(err.message)
        dispatch({
          type: PROFILE_ERROR,
          payload: err
        })
      }
    }
  }
}

// get profile by user id
export const fetchProfileByIdGenerator = userId => {
  return async dispatch => {
    try {
      const res = await axios.get(`/api/profiles/user/${userId}`)
      if (res.status === 200) {
        dispatch({
          type: GET_PROFILE,
          payload: res.data
        })
      }
    } catch (err) {
      // server responded with no 2** status
      if (err.response) {
        const { status } = err.response
        const { errors } = err.response.data

        if (status === 404) {
          dispatch(setAlert('failed to load profile', 'danger'))
        } else {
          dispatch(setAlert('something went wrong', 'danger'))
        }
        dispatch({
          type: PROFILE_ERROR,
          payload: errors[0]
        })
      } else {
        dispatch(setAlert('something went wrong', 'danger'))
        // no response is received
        console.log(err.message)
        dispatch({
          type: PROFILE_ERROR,
          payload: err
        })
      }
    }
  }
}

// set profile image and get updated profile by user id
export const setImgAndFetchProfileGenerator = (userId, data) => {
  const config = {
    url: '/api/users/image',
    method: 'patch',
    headers: { 'Content-Type': 'application/json' },
    data
  }
  return async dispatch => {
    try {
      // send image first ->
      const resImage = await axios(config)
      if (resImage.status === 204) {
        dispatch(setAlert('New image saved', 'success'))
        // than get updated profile ->
        const resProfile = await axios.get(`/api/profiles/user/${userId}`)
        if (resProfile.status === 200) {
          dispatch({
            type: GET_PROFILE,
            payload: resProfile.data
          })
        }
      }
    } catch (err) {
      dispatch(setAlert('something went wrong', 'danger'))
      // server responded with no 2** status
      if (err.response) {
        const { status } = err.response
        const { errors } = err.response.data
        if (status === 500 || status === 404 || status === 422) {
          dispatch({
            type: PROFILE_ERROR,
            payload: errors[0]
          })
        }
      } else {
        // no response is received OR status 400
        console.log(err.message)
        dispatch({
          type: PROFILE_ERROR,
          payload: err
        })
      }
    }
  }
}

// toggle profile image usage & get updated profile by user id
export const toggleImgAndFetchProfileGenerator = userId => {
  return async dispatch => {
    try {
      // toggle profile img usage first ->
      const resImage = await axios.patch('/api/users/image/toggle')
      if (resImage.status === 204) {
        // than get updated profile ->
        const resProfile = await axios.get(`/api/profiles/user/${userId}`)
        if (resProfile.status === 200) {
          dispatch({
            type: GET_PROFILE,
            payload: resProfile.data
          })
          dispatch({
            type: UPLOADED_USER_UPDATE,
            payload: {
              useImage: resProfile.data.user.useImage,
              image: resProfile.data.user.image
            }
          })
          dispatch(setAlert('Avatar switched', 'success'))
        }
      }
    } catch (err) {
      dispatch(setAlert('something went wrong', 'danger'))
      // server responded with no 2** status
      if (err.response) {
        const { status } = err.response
        const { errors } = err.response.data
        if (status === 500 || status === 404) {
          dispatch({
            type: PROFILE_ERROR,
            payload: errors[0]
          })
        }
      } else {
        // no response is received OR status 400
        console.log(err.message)
        dispatch({
          type: PROFILE_ERROR,
          payload: err
        })
      }
    }
  }
}

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
          dispatch(setAlert('something went wrong', 'danger'))
        }
      } else {
        // no response is received
        console.log(err.message)
        dispatch(setAlert('something went wrong', 'danger'))
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

// should add logic for handling 404!
export const deleteExperienceGenerator = id => {
  return async dispatch => {
    try {
      const res = await axios.delete(`api/profiles/experience/${id}`)
      if (res.status === 204) {
        dispatch(setAlert('experience deleted', 'success'))
        dispatch({
          type: DELETE_EXPERIENCE
        })
        dispatch(fetchProfileGenerator())
      }
    } catch (err) {
      // server responded with no 2** status
      if (err.response) {
        const { status } = err.response
        const { errors } = err.response.data
        if (status === 500) {
          dispatch(setAlert(errors[0].msg, 'danger'))
        }
        dispatch({
          type: DELETE_EXPERIENCE_ERROR,
          payload: errors[0]
        })
      } else {
        // no response is received
        console.log(err.message)
        dispatch(setAlert('something went wrong', 'danger'))
        dispatch({
          type: DELETE_EXPERIENCE_ERROR,
          payload: err
        })
      }
    }
  }
}

// should add logic for handling 404!
export const deleteEducationGenerator = id => {
  return async dispatch => {
    try {
      const res = await axios.delete(`api/profiles/education/${id}`)
      if (res.status === 204) {
        dispatch(setAlert('education deleted', 'success'))
        dispatch({
          type: DELETE_EDUCATION
        })
        dispatch(fetchProfileGenerator())
      }
    } catch (err) {
      // server responded with no 2** status
      if (err.response) {
        const { status } = err.response
        const { errors } = err.response.data
        if (status === 500) {
          dispatch(setAlert(errors[0].msg, 'danger'))
        }
        dispatch({
          type: DELETE_EDUCATION_ERROR,
          payload: errors[0]
        })
      } else {
        // no response is received
        console.log(err.message)
        dispatch(setAlert('something went wrong', 'danger'))
        dispatch({
          type: DELETE_EDUCATION_ERROR,
          payload: err
        })
      }
    }
  }
}

export const accountDeleteGenerator = () => {
  return async dispatch => {
    try {
      const res = await axios.delete('api/profiles')
      if (res.status === 204) {
        dispatch({
          type: CLEAR_PROFILE
        })
        dispatch({
          type: CLEAR_PROFILES
        })
        await axios.delete('api/users/unregister')
        dispatch({
          type: ACCOUNT_DELETED
        })
        dispatch(setAlert('account deleted'))
      }
    } catch (err) {
      if (err.response) {
        const { status } = err.response
        const { errors } = err.response.data
        if (status === 500 || status === 404) {
          dispatch(setAlert(errors[0].msg, 'danger'))
        }
        dispatch({
          type: PROFILE_ERROR,
          payload: errors[0]
        })
      } else {
        // no response is received
        console.log(err.message)
        dispatch(setAlert('something went wrong', 'danger'))
        dispatch({
          type: PROFILE_ERROR,
          payload: err
        })
      }
    }
  }
}

// get user repos by user github name
export const getReposGenerator = githubName => {
  return async dispatch => {
    try {
      const res = await axios.get(`/api/profiles/github/${githubName}`)
      if (res.status === 200) {
        dispatch({
          type: GET_REPOS,
          payload: res.data
        })
      }
    } catch (err) {
      dispatch(setAlert('Failed to fetch github repos', 'danger'))
      // server responded with no 2** status
      if (err.response) {
        const { status } = err.response
        const { errors } = err.response.data
        if (status === 500 || status === 404) {
          dispatch({
            type: PROFILE_ERROR,
            payload: errors[0]
          })
        }
      } else {
        // no response is received
        console.log(err.message)
        dispatch({
          type: PROFILE_ERROR,
          payload: err
        })
      }
    }
  }
}
