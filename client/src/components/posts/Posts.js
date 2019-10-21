import React, { useEffect, Fragment } from 'react'
import { connect } from 'react-redux'
import { fetchPostsGenerator } from '../../store/actions/post'
import Spinner from '../layout/Spinner'
import PostItem from './PostItem'
import PostForm from './PostForm'
import Alert from '../layout/Alert'

const Posts = ({ loadPosts, posts, isLoading, isAuthenticated, alerts }) => {
  useEffect(() => {
    if (isAuthenticated) {
      loadPosts()
    }
  }, [isAuthenticated])

  return (
    <section className='container'>
      {alerts.length > 0 && <Alert />}
      {isAuthenticated && !isLoading ? (
        <Fragment>
          <h1 className='large text-primary'>Posts</h1>
          <p className='lead'>
            <i className='fas fa-user'></i> Welcome to the community
          </p>
          <div className='post-form'>
            <div className='post-form-header bg-primary'>
              <h3>Say something...</h3>
            </div>
            <PostForm />
            <div className='posts'>
              {posts.length > 0 ? (
                posts.map(post => <PostItem key={post._id} post={post} />)
              ) : (
                <h4>No posts found</h4>
              )}
            </div>
          </div>
        </Fragment>
      ) : (
        <Spinner />
      )}
    </section>
  )
}

const mapStateToProps = state => ({
  alerts: state.alerts,
  posts: state.post.posts,
  isAuthenticated: state.authentication.isAuthenticated,
  isLoading: state.post.loading
})

const mapDispatchToProps = dispatch => ({
  loadPosts: () => dispatch(fetchPostsGenerator())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Posts)
