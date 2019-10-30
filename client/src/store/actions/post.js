import axios from 'axios'
import { setAlert } from './alert'
import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  DELETE_COMMENT,
  UPDATE_COMMENT_LIKES,
  UPDATE_COMMENT_TEXT,
  UPDATE_POST_TEXT
} from '../actions/types'

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

// update post by id
export const updatePostByIdGenerator = (postId, text) => {
  const config = {
    url: `/api/posts/${postId}`,
    method: 'patch',
    headers: { 'Content-Type': 'application/json' },
    data: { text }
  }
  return async dispatch => {
    try {
      const res = await axios(config)
      if (res.status === 200) {
        dispatch({
          type: UPDATE_POST_TEXT,
          payload: res.data
        })
      }
    } catch (err) {
      // server responded with no 2** status
      if (err.response) {
        const { status } = err.response
        if (
          status === 422 ||
          status === 401 ||
          status === 404 ||
          status === 500
        ) {
          const { errors } = err.response.data
          dispatch({
            type: POST_ERROR,
            payload: errors[0]
          })
        }
      } else {
        // no response is received (or status 400)
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

// get post by id
export const fetchPostByIdGenerator = postId => {
  return async dispatch => {
    try {
      const res = await axios.get(`/api/posts/${postId}`)
      if (res.status === 200) {
        dispatch({
          type: GET_POST,
          payload: res.data
        })
      }
    } catch (err) {
      // server responded with no 2** status
      if (err.response) {
        const { status } = err.response
        if (
          status === 400 ||
          status === 404 ||
          status === 401 ||
          status === 500
        ) {
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

// add & remove like on post
export const likesGenerator = postId => {
  return async dispatch => {
    try {
      const res = await axios.patch(`/api/posts/${postId}/likes`)
      if (res.status === 200) {
        dispatch({
          type: UPDATE_LIKES,
          payload: { postId, likes: res.data }
        })
      }
    } catch (err) {
      // server responded with no 2** status
      if (err.response) {
        const { status } = err.response
        if (status === 404 || status === 500 || status === 401) {
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

// add & remove like on comment
export const likeCommentGenerator = (postId, commentId) => {
  return async dispatch => {
    try {
      const res = await axios.patch(
        `/api/posts/${postId}/comments/${commentId}/likes`
      )
      if (res.status === 200) {
        dispatch({
          type: UPDATE_COMMENT_LIKES,
          payload: { id: commentId, likes: res.data }
        })
      }
    } catch (err) {
      // server responded with no 2** status
      if (err.response) {
        const { status } = err.response
        if (status === 404 || status === 500 || status === 401) {
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

// delete post
export const deletePostGenerator = postId => {
  return async dispatch => {
    try {
      const res = await axios.delete(`api/posts/${postId}`)
      if (res.status === 204) {
        dispatch({
          type: DELETE_POST,
          payload: postId
        })
        dispatch(setAlert('post deleted', 'success'))
      }
    } catch (err) {
      // server responded with no 2** status
      if (err.response) {
        const { status } = err.response
        if (
          status === 404 ||
          status === 403 ||
          status === 500 ||
          status === 401
        ) {
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

// add post
export const addPostGenerator = data => {
  const config = {
    url: '/api/posts',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data
  }
  return async dispatch => {
    try {
      const res = await axios(config)
      if (res.status === 201) {
        dispatch({
          type: ADD_POST,
          payload: res.data
        })
        dispatch(setAlert('post added', 'success'))
      }
    } catch (err) {
      // server responded with no 2** status
      if (err.response) {
        const { status } = err.response
        if (status === 422 || status === 401 || status === 500) {
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

// add comment
// in-> postId & data ({ text: value })
export const addCommentGenerator = (postId, data) => {
  const config = {
    url: `/api/posts/${postId}/comments`,
    method: 'patch',
    headers: { 'Content-Type': 'application/json' },
    data
  }
  return async dispatch => {
    try {
      const res = await axios(config)
      if (res.status === 201) {
        dispatch({
          type: ADD_COMMENT,
          payload: res.data
        })
        dispatch(setAlert('comment added', 'success'))
      }
    } catch (err) {
      // server responded with no 2** status
      if (err.response) {
        const { status } = err.response
        if (
          status === 422 ||
          status === 401 ||
          status === 404 ||
          status === 500
        ) {
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

//update comment
//@route   PATCH api/posts/:post_id/comments/:comment_id
export const updateCommentTextGenerator = (postId, commentId, text) => {
  const config = {
    url: `/api/posts/${postId}/comments/${commentId}`,
    method: 'patch',
    headers: { 'Content-Type': 'application/json' },
    data: { text }
  }
  return async dispatch => {
    try {
      const res = await axios(config)
      if (res.status === 200) {
        dispatch({
          type: UPDATE_COMMENT_TEXT,
          payload: {
            id: res.data._id,
            text: res.data.text,
            wasUpdated: res.data.wasUpdated
          }
        })
      }
    } catch (err) {
      // server responded with no 2** status
      if (err.response) {
        const { status } = err.response
        if (
          status === 404 ||
          status === 500 ||
          status === 401 ||
          status === 422
        ) {
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

// delete comment
// in-> postId & commentId
export const deleteCommentGenerator = (postId, commentId) => {
  return async dispatch => {
    try {
      const res = await axios.delete(
        `/api/posts/${postId}/comments/${commentId}`
      )
      if (res.status === 200) {
        dispatch({
          type: DELETE_COMMENT,
          payload: commentId
        })
        dispatch(setAlert('comment deleted', 'success'))
      }
    } catch (err) {
      // server responded with no 2** status
      if (err.response) {
        const { status } = err.response
        if (status === 401 || status === 404 || status === 500) {
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
