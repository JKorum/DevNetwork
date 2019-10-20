import axios from 'axios'
import { setAlert } from './alert'
import { GET_POSTS, POST_ERROR } from '../actions/types'

// get posts
export const fetchPostsGenerator = () => {
  return async dispatch => {
    try {
      const res = await axios.get('/api/posts')
      if (res.status === 200) {
        dispatch({
          type: GET_POSTS,
          payload: res.data
        })
      }
    } catch (err) {
      // server responded with no 2** status
      if (err.response) {
        const { status } = err.response
        if (status === 400 || status === 422 || status === 401) {
          const { errors } = err.response.data
          dispatch({
            type: POST_ERROR,
            payload: errors[0]
          })
        }
      } else {
        // no response is received
        console.log(err.message)
        dispatch(setAlert('something went wrong', 'danger'))
        dispatch({
          type: POST_ERROR,
          payload: err
        })
      }
    }
  }
}
