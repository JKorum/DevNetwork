import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { fetchPostsGenerator } from '../../store/actions/post'
import Spinner from '../layout/Spinner'

const Posts = ({ loadPosts, posts, isLoading }) => {
  useEffect(() => {
    loadPosts()
  }, [])

  return <div>hello posts</div>
}

const mapStateToProps = state => ({
  posts: state.post.posts,
  isLoading: state.post.loading
})

const mapDispatchToProps = dispatch => ({
  loadPosts: () => dispatch(fetchPostsGenerator())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Posts)
