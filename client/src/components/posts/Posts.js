import React, { useEffect, Fragment, useState } from 'react'
import { connect } from 'react-redux'
import { fetchPostsGenerator } from '../../store/actions/post'
import Spinner from '../layout/Spinner'
import PostItem from './PostItem'
import PostForm from './PostForm'
import Alert from '../layout/Alert'
import moment from 'moment'

const Posts = ({
  loadPosts,
  posts,
  isLoading,
  isAuthenticated,
  alerts,
  history,
  user
}) => {
  const [localPosts, setLocalPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])

  useEffect(() => {
    if (isAuthenticated) {
      loadPosts()
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (posts !== undefined) {
      // check if new post was added
      const isNewPostAdded = posts.length > localPosts.length ? true : false

      // local posts are always synchronized with global state
      // they are used to produce filtered / sorted posts
      setLocalPosts(posts)

      if (filteredPosts.length === 0 || isNewPostAdded) {
        // necessary because only filtered posts are rendered
        setFilteredPosts(posts)
      } else {
        const updatedFilteredPosts = []

        for (const localPost of filteredPosts) {
          for (const globalPost of posts) {
            if (localPost._id === globalPost._id) {
              updatedFilteredPosts.push(globalPost)
            }
          }
        }

        setFilteredPosts(updatedFilteredPosts)
      }
    }
  }, [posts])

  const handleFilter = e => {
    const result = localPosts.filter(post =>
      post.ownerName.toLowerCase().includes(e.target.value.toLowerCase())
    )
    setFilteredPosts(result)
  }

  const handleSortByLikes = e => {
    // just in case create a deep copy of posts...
    const temp = JSON.parse(JSON.stringify(filteredPosts))
    // execute sorting
    const result = temp.sort((a, b) => {
      if (a.likes.length > b.likes.length) {
        return -1
      } else if (a.likes.length < b.likes.length) {
        return 1
      } else {
        return 0
      }
    })
    setFilteredPosts(result)
  }

  const handleSortByComments = e => {
    // just in case create a deep copy of posts...
    const temp = JSON.parse(JSON.stringify(filteredPosts))
    // execute sorting
    const result = temp.sort((a, b) => {
      if (a.comments.length > b.comments.length) {
        return -1
      } else if (a.comments.length < b.comments.length) {
        return 1
      } else {
        return 0
      }
    })
    setFilteredPosts(result)
  }

  const handleSortByTime = e => {
    // just in case create a deep copy of posts...
    const temp = JSON.parse(JSON.stringify(filteredPosts))
    // execute sorting
    const result = temp.sort((a, b) => {
      if (moment(a.createdAt).isAfter(moment(b.createdAt))) {
        return -1
      } else if (moment(a.createdAt).isBefore(moment(b.createdAt))) {
        return 1
      } else {
        return 0
      }
    })
    setFilteredPosts(result)
  }

  return (
    <section className='container'>
      {alerts.length > 0 && <Alert />}
      {isAuthenticated && !isLoading ? (
        <Fragment>
          <h1 className='large text-primary mx-1'>Posts</h1>

          <div className='post-form'>
            <div className='post-form-header bg-primary mx-1'>
              <h4>Filter by</h4>
              <input
                id='filter'
                type='text'
                placeholder='author name...'
                onChange={handleFilter}
              />
              <h4>Sort by</h4>
              <i className='fas fa-heart fa-lg' onClick={handleSortByLikes}></i>
              <i
                className='fas fa-comment fa-lg'
                onClick={handleSortByComments}
              ></i>

              <i className='fas fa-clock fa-lg' onClick={handleSortByTime}></i>
            </div>

            <PostForm
              image={user.useImage ? user.image : user.avatar}
              postsNumber={posts.length}
            />

            <div className='posts'>
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                  <PostItem key={post._id} post={post} history={history} />
                ))
              ) : (
                <div className='filter_results mx-1'>
                  <h4>No posts found</h4>
                </div>
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
  user: state.authentication.user,
  isLoading: state.post.loading
})

const mapDispatchToProps = dispatch => ({
  loadPosts: () => dispatch(fetchPostsGenerator())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Posts)
