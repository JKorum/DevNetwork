import React, { useEffect, Fragment } from 'react'
import { connect } from 'react-redux'
import { fetchPostsGenerator } from '../../store/actions/post'
import Spinner from '../layout/Spinner'
import PostItem from './PostItem'
import PostForm from './PostForm'

const Posts = ({ loadPosts, posts, isLoading, isAuthenticated }) => {
  useEffect(() => {
    if (isAuthenticated) {
      loadPosts()
    }
  }, [isAuthenticated])

  return (
    <section className='container'>
      {isAuthenticated && !isLoading ? (
        <Fragment>
          <h1 className='large text-primary'>Posts</h1>
          <p className='lead'>
            <i className='fas fa-user'></i>Welcome to the community
          </p>
          <PostForm />
          <div className='posts'>
            {posts.length > 0 ? (
              posts.map(post => <PostItem key={post._id} post={post} />)
            ) : (
              <h4>No posts found</h4>
            )}
          </div>
        </Fragment>
      ) : (
        <Spinner />
      )}
    </section>
  )
}

const mapStateToProps = state => ({
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

/*

<section class="container">
  <h1 class="large text-primary">Posts</h1>
  <p class="lead"><i class="fas fa-user"></i>Welcome to the community</p>
  <div class="post-form">
    <div class="post-form-header bg-primary">
      <h3>Say something...</h3>
    </div>
    <form class="form my-1">
      <textarea cols="30" rows="5" placeholder="Create a post"></textarea>
      <input type="submit" value="submit" class="btn btn-dark my-1" />
    </form>

    <div class="posts">
      <div class="post bg-white my-1 p-1">
        <div>
          <a href="profile.html">
            <img
              class="round-img my-1"
              src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200"
              alt="an image of a developer"
            />
            <h4>John Doe</h4>
          </a>
        </div>
        <div>
          <p class="my-1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos
            totam ab inventore neque ad doloremque, molestias laboriosam
            voluptatum cumque dignissimos, eius veniam et obcaecati fuga
            excepturi provident aut odio dolor. Porro quaerat numquam,
            consequatur nihil blanditiis cumque quod odio dolore natus harum
            assumenda minus molestiae ducimus dolorum rerum culpa vero.
          </p>
          <button class="btn">
            <i class="fas fa-thumbs-up"></i>
            <span>4</span>
          </button>
          <button class="btn">
            <i class="fas fa-thumbs-up"></i>
          </button>
          <a href="post.html" class="btn btn-primary">Discussion</a>
        </div>
      </div>
          
    </div>
  </div>
      </div>
</section>


*/
