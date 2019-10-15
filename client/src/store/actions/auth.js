import axios from 'axios'
import { REGISTER_SUCCESS, REGISTER_FAIL } from '../actions/types'
import { setAlert } from './alert'

// in-> { name, email, password } out-> async function
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
      }
    }
  }
}
