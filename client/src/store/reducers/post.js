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
  SORT_COMMENTS_LIKES,
  SORT_COMMENTS_TIME,
  UPDATE_POST_TEXT
} from '../actions/types'

import moment from 'moment'

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {}
}

// reducer use shallow copies of state -> refactor using deep copying
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_POSTS:
      return {
        ...state,
        posts: action.payload,
        loading: false
      }
    case GET_POST:
      return {
        ...state,
        post: action.payload,
        loading: false
      }
    case ADD_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts],
        loading: false
      }
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload),
        loading: false
      }
    case POST_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case UPDATE_POST_TEXT:
      return {
        ...state,
        posts: state.posts.map(post => {
          if (post._id === action.payload._id) {
            return action.payload
          } else {
            return post
          }
        }),
        post: action.payload,
        loading: false
      }
    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === action.payload.postId
            ? { ...post, likes: action.payload.likes }
            : post
        ),
        post: { ...state.post, likes: action.payload.likes },
        loading: false
      }
    case UPDATE_COMMENT_TEXT:
      const comments_t = state.post.comments.map(comment => {
        if (comment._id === action.payload.id) {
          return {
            ...comment,
            text: action.payload.text,
            wasUpdated: action.payload.wasUpdated
          }
        } else {
          return comment
        }
      })
      return {
        ...state,
        post: { ...state.post, comments: comments_t },
        loading: false
      }
    case UPDATE_COMMENT_LIKES:
      const comments = state.post.comments.map(comment => {
        if (comment._id === action.payload.id) {
          return { ...comment, likes: action.payload.likes }
        } else {
          return comment
        }
      })
      return {
        ...state,
        post: { ...state.post, comments },
        loading: false
      }
    case ADD_COMMENT:
      return {
        ...state,
        post: { ...state.post, comments: action.payload },
        loading: false
      }
    case DELETE_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comments: state.post.comments.filter(
            comment => comment._id !== action.payload
          )
        },
        loading: false
      }
    case SORT_COMMENTS_LIKES:
      const commentsSortedLikes = state.post.comments.sort((a, b) => {
        if (a.likes.length > b.likes.length) {
          return -1
        } else if (a.likes.length < b.likes.length) {
          return 1
        } else {
          return 0
        }
      })
      return {
        ...state,
        post: { ...state.post, comments: commentsSortedLikes }
      }
    case SORT_COMMENTS_TIME:
      const commentsSortedTime = state.post.comments.sort((a, b) => {
        if (moment(a.createdAt).isAfter(moment(b.createdAt))) {
          return -1
        } else if (moment(a.createdAt).isBefore(moment(b.createdAt))) {
          return 1
        } else {
          return 0
        }
      })
      return {
        ...state,
        post: { ...state.post, comments: commentsSortedTime }
      }
    default:
      return state
  }
}
