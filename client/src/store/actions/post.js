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
  UPDATE_POST_TEXT,
  CLEAR_PROFILE
} from '../actions/types'

// get posts
export const fetchPostsGenerator = () => {
  return async dispatch => {
    try {
      dispatch({
        type: CLEAR_PROFILE
      })

      const res = await axios.get('/api/posts')
      if (res.status === 200) {
        dispatch({
          type: GET_POSTS,
          payload: res.data
        })
      }
    } catch (err) {
      dispatch(setAlert('failed to fetch posts', 'danger'))
      // server responded with no 2** status
      if (err.response) {
        console.log('posts error:', err)
        dispatch({
          type: POST_ERROR,
          payload: { msg: 'failed to fetch posts', status: 'server responded' }
        })

        // const { status } = err.response
        // if (status === 400 || status === 422 || status === 401) {
        //   const { errors } = err.response.data
        //   dispatch({
        //     type: POST_ERROR,
        //     payload: errors[0]
        //   })
        // }
      } else {
        // no response is received
        console.log('posts error:', err)
        dispatch({
          type: POST_ERROR,
          payload: {
            msg: 'failed to fetch posts',
            status: 'no response from server'
          }
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
        dispatch(setAlert('post updated', 'success'))
      }
    } catch (err) {
      dispatch(setAlert('something went wrong', 'danger'))
      // server responded with no 2** status
      if (err.response) {
        console.log('update post error:', err)
        dispatch({
          type: POST_ERROR,
          payload: { msg: 'failed to update post', status: 'server responded' }
        })
        // const { status } = err.response
        // if (
        //   status === 422 ||
        //   status === 401 ||
        //   status === 404 ||
        //   status === 500
        // ) {
        //   const { errors } = err.response.data
        //   dispatch({
        //     type: POST_ERROR,
        //     payload: errors[0]
        //   })
        // }
      } else {
        // no response is received (or status 400)
        console.log('update post error:', err)

        dispatch({
          type: POST_ERROR,
          payload: {
            msg: 'failed to update post',
            status: 'no response from server'
          }
        })
      }
    }
  }
}

// get post by id
export const fetchPostByIdGenerator = postId => {
  return async dispatch => {
    try {
      dispatch({
        type: CLEAR_PROFILE
      })

      const res = await axios.get(`/api/posts/${postId}`)
      if (res.status === 200) {
        dispatch({
          type: GET_POST,
          payload: res.data
        })
      }
    } catch (err) {
      dispatch(setAlert('failed to fetch post', 'danger'))
      // server responded with no 2** status
      if (err.response) {
        console.log('fetch post error:', err)

        dispatch({
          type: POST_ERROR,
          payload: { msg: 'failed to fetch post', status: 'server responded' }
        })
        // const { status } = err.response
        // if (
        //   status === 400 ||
        //   status === 404 ||
        //   status === 401 ||
        //   status === 500
        // ) {
        //   const { errors } = err.response.data
        //   dispatch({
        //     type: POST_ERROR,
        //     payload: errors[0]
        //   })
        // }
      } else {
        // no response is received
        console.log('fetch post error:', err)

        dispatch({
          type: POST_ERROR,
          payload: {
            msg: 'failed to fetch post',
            status: 'no response from server'
          }
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
      dispatch(setAlert('something went wrong', 'danger'))
      // server responded with no 2** status
      if (err.response) {
        console.log('like error:', err)
        dispatch({
          type: POST_ERROR,
          payload: {
            msg: 'failed to toggle like on post',
            status: 'server responded'
          }
        })

        // const { status } = err.response
        // if (status === 404 || status === 500 || status === 401) {
        //   const { errors } = err.response.data
        //   dispatch({
        //     type: POST_ERROR,
        //     payload: errors[0]
        //   })
        // }
      } else {
        // no response is received
        console.log('like error:', err)

        dispatch({
          type: POST_ERROR,
          payload: {
            msg: 'failed to toggle like on post',
            status: 'no response from server'
          }
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
      dispatch(setAlert('something went wrong', 'danger'))
      // server responded with no 2** status
      if (err.response) {
        console.log('like error:', err)
        dispatch({
          type: POST_ERROR,
          payload: {
            msg: 'failed to toggle like on comment',
            status: 'server responded'
          }
        })

        // const { status } = err.response
        // if (status === 404 || status === 500 || status === 401) {
        //   const { errors } = err.response.data
        //   dispatch({
        //     type: POST_ERROR,
        //     payload: errors[0]
        //   })
        // }
      } else {
        // no response is received
        console.log('like error:', err)

        dispatch({
          type: POST_ERROR,
          payload: {
            msg: 'failed to toggle like on comment',
            status: 'no response from server'
          }
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
        // following block is added to fix a bug that occurred during redirection
        const res = await axios.get('/api/posts')
        if (res.status === 200) {
          dispatch({
            type: GET_POSTS,
            payload: res.data
          })
        }
      }
    } catch (err) {
      dispatch(setAlert('something went wrong', 'danger'))
      // server responded with no 2** status
      if (err.response) {
        console.log('delete post error:', err)
        dispatch({
          type: POST_ERROR,
          payload: { msg: 'failed to delete post', status: 'server responded' }
        })

        // const { status } = err.response
        // if (
        //   status === 404 ||
        //   status === 403 ||
        //   status === 500 ||
        //   status === 401
        // ) {
        //   const { errors } = err.response.data
        //   dispatch({
        //     type: POST_ERROR,
        //     payload: errors[0]
        //   })
        // }
      } else {
        // no response is received
        console.log('delete post error:', err)

        dispatch({
          type: POST_ERROR,
          payload: {
            msg: 'failed to delete post',
            status: 'no response from server'
          }
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
      dispatch(setAlert('something went wrong', 'danger'))
      // server responded with no 2** status
      if (err.response) {
        console.log('add post error:', err)

        dispatch({
          type: POST_ERROR,
          payload: { msg: 'failed to add post', status: 'server responded' }
        })

        // const { status } = err.response
        // if (status === 422 || status === 401 || status === 500) {
        //   const { errors } = err.response.data
        //   dispatch({
        //     type: POST_ERROR,
        //     payload: errors[0]
        //   })
        // }
      } else {
        // no response is received
        console.log('add post error:', err)

        dispatch({
          type: POST_ERROR,
          payload: {
            msg: 'failed to add post',
            status: 'no response from server'
          }
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
      dispatch(setAlert('something went wrong', 'danger'))
      // server responded with no 2** status
      if (err.response) {
        console.log('add comment error:', err)

        dispatch({
          type: POST_ERROR,
          payload: { msg: 'failed to add comment', status: 'server responded' }
        })

        // const { status } = err.response
        // if (
        //   status === 422 ||
        //   status === 401 ||
        //   status === 404 ||
        //   status === 500
        // ) {
        //   const { errors } = err.response.data
        //   dispatch({
        //     type: POST_ERROR,
        //     payload: errors[0]
        //   })
        // }
      } else {
        // no response is received
        console.log('add comment error:', err)

        dispatch({
          type: POST_ERROR,
          payload: {
            msg: 'failed to add comment',
            status: 'no response from server'
          }
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
        dispatch(setAlert('comment updated', 'success'))
      }
    } catch (err) {
      dispatch(setAlert('something went wrong', 'danger'))
      // server responded with no 2** status
      if (err.response) {
        console.log('update comment error:', err)
        dispatch({
          type: POST_ERROR,
          payload: {
            msg: 'failed to update comment',
            status: 'server responded'
          }
        })

        // const { status } = err.response
        // if (
        //   status === 404 ||
        //   status === 500 ||
        //   status === 401 ||
        //   status === 422
        // ) {
        //   const { errors } = err.response.data
        //   dispatch({
        //     type: POST_ERROR,
        //     payload: errors[0]
        //   })
        // }
      } else {
        // no response is received
        console.log('update comment error:', err)

        dispatch({
          type: POST_ERROR,
          payload: {
            msg: 'failed to update comment',
            status: 'no response from server'
          }
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
      dispatch(setAlert('something went wrong', 'danger'))
      // server responded with no 2** status
      if (err.response) {
        console.log('delete comment error:', err)

        dispatch({
          type: POST_ERROR,
          payload: {
            msg: 'failed to delete comment',
            status: 'server responded'
          }
        })

        // const { status } = err.response
        // if (status === 401 || status === 404 || status === 500) {
        //   const { errors } = err.response.data
        //   dispatch({
        //     type: POST_ERROR,
        //     payload: errors[0]
        //   })
        // }
      } else {
        // no response is received
        console.log('delete comment error:', err)

        dispatch({
          type: POST_ERROR,
          payload: {
            msg: 'failed to delete comment',
            status: 'no response from server'
          }
        })
      }
    }
  }
}
