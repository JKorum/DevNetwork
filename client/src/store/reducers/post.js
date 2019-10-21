import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  DELETE_COMMENT
} from '../actions/types'

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
    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === action.payload.postId
            ? { ...post, likes: action.payload.likes }
            : post
        ),
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
    default:
      return state
  }
}
