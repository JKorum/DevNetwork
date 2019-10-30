import React, { useEffect, useState, Fragment } from 'react'
import { connect } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import Moment from 'react-moment'
import { fetchPostByIdGenerator } from '../../store/actions/post'
import Spinner from '../layout/Spinner'
import CommentForm from './CommentForm'
import CommentItem from './CommentItem'
import Alert from '../layout/Alert'
import {
  SORT_COMMENTS_LIKES,
  SORT_COMMENTS_TIME
} from '../../store/actions/types'
import setHeartClass from '../../utils/setHeartClass'
import {
  likesGenerator,
  updatePostByIdGenerator,
  deletePostGenerator
} from '../../store/actions/post'
import DevelopersTalk from './DevelopersTalk'

const Post = ({
  auth,
  post,
  isLoading,
  loadPost,
  alerts,
  sortCommentsLikes,
  sortCommentsTime,
  likePost,
  updatePost,
  deletePost,
  history
}) => {
  const { post_id } = useParams()

  useEffect(() => {
    if (auth.isAuthenticated) {
      const id = post_id
      loadPost(id)
    }
  }, [auth.isAuthenticated])

  useEffect(() => {
    if (post) {
      setPostText(post.text)
    }
  }, [post])

  const [waitForUpdate, setWaitForUpdate] = useState(false)
  const [postText, setPostText] = useState(post ? post.text : '')

  const handlePostLike = e => {
    likePost(post._id)
  }

  const handlePostTextChange = e => {
    setPostText(e.target.value)
  }

  const handleUpdatePost = e => {
    updatePost(post._id, postText)
    setWaitForUpdate(false)
  }

  // modal popup should be integrated
  const handleDeletePost = e => {
    deletePost(post._id)
    history.push('/posts')
  }

  return (
    <section className='container'>
      {alerts.length > 0 && <Alert />}
      {!isLoading && post ? (
        <Fragment>
          <div className='container__mini_banner mx-1'>
            <Link to='/posts' className='btn'>
              Back to posts
            </Link>
            {post.comments.length > 0 && (
              <DevelopersTalk comments={post.comments} />
            )}
          </div>
          <div className='post my-1 p-1'>
            <div className='post__avatar_container'>
              {/* if link directs to non-existent profile -> there will be a instant spinner -> fix it  */}
              <Link to={`/profiles/${post.owner}`}>
                <img className='round-img' src={post.avatar} />
              </Link>
            </div>
            <div>
              <div className='comment__info px-xs'>
                <h2>
                  Posted {<Moment date={post.createdAt} fromNow={true} />} by{' '}
                  {post.ownerName}
                </h2>
                {post.wasUpdated && (
                  <h4 className='comment__head_text'>edited</h4>
                )}
              </div>

              <div className='post__text_container'>
                {!waitForUpdate ? (
                  <p>{post.text}</p>
                ) : (
                  <input
                    type='text'
                    value={postText}
                    onChange={handlePostTextChange}
                    autoFocus={true}
                  />
                )}
              </div>

              <div className='comment__manageboard'>
                <div className='comment__likes'>
                  <i
                    onClick={handlePostLike}
                    className={`fas fa-heart fa-lg${setHeartClass(
                      post.likes,
                      auth.user._id
                    )}`}
                  ></i>{' '}
                  {post.likes.length > 0 && <p>{post.likes.length}</p>}
                </div>
                <div className='comment__buttons'>
                  {auth.user._id === post.owner && (
                    <Fragment>
                      <button
                        type='button'
                        className='btn btn-dark'
                        onClick={
                          !waitForUpdate
                            ? e => setWaitForUpdate(true)
                            : handleUpdatePost
                        }
                      >
                        {!waitForUpdate ? 'Update' : 'Submit'}
                      </button>
                      <button
                        type='button'
                        className='btn btn-red'
                        onClick={
                          !waitForUpdate
                            ? handleDeletePost
                            : e => setWaitForUpdate(false)
                        }
                      >
                        {!waitForUpdate ? 'Delete' : 'Cancel'}
                      </button>
                    </Fragment>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className='post-form'>
            <div className='post-form-header bg-primary mx-1'>
              <h4>Sort by</h4>
              <i
                className='fas fa-heart fa-lg'
                onClick={e => post.comments.length > 1 && sortCommentsLikes()}
              ></i>

              <i
                className='fas fa-clock fa-lg'
                onClick={e => post.comments.length > 1 && sortCommentsTime()}
              ></i>
            </div>
            <CommentForm postId={post_id} />
            <div className='posts'>
              {post.comments.length > 0 &&
                post.comments.map(comment => (
                  <CommentItem
                    key={comment._id}
                    postId={post_id}
                    comment={comment}
                  />
                ))}
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
  auth: state.authentication,
  alerts: state.alerts,
  post: state.post.post,
  isLoading: state.post.loading
})

const mapDispatchToProps = dispatch => ({
  loadPost: postId => dispatch(fetchPostByIdGenerator(postId)),
  sortCommentsLikes: () => dispatch({ type: SORT_COMMENTS_LIKES }),
  sortCommentsTime: () => dispatch({ type: SORT_COMMENTS_TIME }),
  likePost: postId => dispatch(likesGenerator(postId)),
  updatePost: (postId, text) => dispatch(updatePostByIdGenerator(postId, text)),
  deletePost: postId => dispatch(deletePostGenerator(postId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Post)
