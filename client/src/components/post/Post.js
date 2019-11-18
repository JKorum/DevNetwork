import React, { useEffect, useState, Fragment } from 'react'
import { connect } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import Moment from 'react-moment'
import ReactModal from 'react-modal'
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
  const [modalOpen, toggleModalOpen] = useState(false)

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

  return (
    <section className='container'>
      {alerts.length > 0 && <Alert />}

      <ReactModal
        isOpen={modalOpen}
        parentSelector={() => document.getElementById('root')}
        appElement={document.getElementById('root')}
        onRequestClose={() => toggleModalOpen(!modalOpen)}
        closeTimeoutMS={200}
        className='modal'
      >
        <h1>Confirm Post Deletion</h1>

        <form
          id='delete_post_form'
          onSubmit={e => {
            e.preventDefault()
            deletePost(post._id)
            history.push('/posts')
          }}
        >
          <h2>Are you sure?</h2>
        </form>
        <div>
          <button
            type='submit'
            form='delete_post_form'
            className='btn modal-red'
          >
            Submit
          </button>
          <button
            type='button'
            onClick={() => toggleModalOpen(!modalOpen)}
            className='btn modal-primary'
          >
            Cancel
          </button>
        </div>
      </ReactModal>

      {!isLoading && post ? (
        <Fragment>
          <div className='container__mini_banner mx-1 post-hide'>
            <Link to='/posts' className='btn'>
              Back to posts
            </Link>
            {post.comments !== undefined
              ? post.comments.length > 0 && (
                  <DevelopersTalk comments={post.comments} />
                )
              : false}
          </div>
          <div className='post my-1 p-1 post_data'>
            <div className='post__avatar_container'>
              {/* if link directs to non-existent profile -> there will be a instant spinner -> fix it  */}
              {post.owner !== null && post.owner !== undefined ? (
                <Link
                  to={`/profiles/${post.owner._id}`}
                  title={'view public profile'}
                >
                  <div className='img_container--posts'>
                    <img
                      src={
                        post.owner.useImage
                          ? post.owner.image
                          : post.owner.avatar
                      }
                    />
                  </div>
                </Link>
              ) : (
                <a title={'non-existent user'} style={{ cursor: 'default' }}>
                  <div className='img_container--posts'>
                    <img src='https://www.gravatar.com/avatar/HASH?s=200&d=retro' />
                  </div>
                </a>
              )}
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
                  <textarea
                    onChange={handlePostTextChange}
                    autoFocus={true}
                    value={postText}
                  ></textarea>
                  // <input
                  //   type='text'
                  //   value={postText}
                  //   onChange={handlePostTextChange}
                  //   autoFocus={true}
                  // />
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
                  {post.likes !== undefined
                    ? post.likes.length > 0 && <p>{post.likes.length}</p>
                    : false}
                </div>
                <div className='comment__buttons'>
                  {post.owner !== null &&
                    post.owner !== undefined &&
                    auth.user._id === post.owner._id && (
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
                              ? e => toggleModalOpen(!modalOpen)
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
                onClick={e =>
                  post.comments !== undefined &&
                  post.comments.length > 1 &&
                  sortCommentsLikes()
                }
              ></i>

              <i
                className='fas fa-clock fa-lg'
                onClick={e =>
                  post.comments !== undefined &&
                  post.comments.length > 1 &&
                  sortCommentsTime()
                }
              ></i>
            </div>
            <CommentForm postId={post_id} />
            <div className='posts'>
              {post.comments !== undefined &&
                post.comments.length > 0 &&
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

export default connect(mapStateToProps, mapDispatchToProps)(Post)
