import axios from 'axios'
import { setAlert } from './alert'

import { GET_PROFILE, PROFILE_ERROR } from '../actions/types'

// get current user profile
export const fetchProfileGenerator = () => {
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
        if (status === 404 || status === 500) {
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
