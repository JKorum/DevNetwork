import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import ReactModal from 'react-modal'
import { likesGenerator, deletePostGenerator } from '../../store/actions/post'
import setHeartClass from '../../utils/setHeartClass'
import setCommentClass from '../../utils/setCommentClass'

const PostItem = ({
  post: { _id, owner, ownerName, text, createdAt, likes, comments, wasUpdated },
  user,
  likeOrUnlike,
  deletePost,
  history
}) => {
  const [modalOpen, toggleModalOpen] = useState(false)

  return (
    <div className='post grid-bottom my-1 p-1'>
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
            deletePost(_id)
            toggleModalOpen(!modalOpen)
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

      <div className='post__avatar_container'>
        {owner !== null ? (
          <Link to={`/profiles/${owner._id}`} title={'view public profile'}>
            <div className='img_container--posts'>
              <img src={owner.useImage ? owner.image : owner.avatar} />
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
            Posted {<Moment date={createdAt} fromNow={true} />} by {ownerName}
          </h2>
          {wasUpdated && <h4 className='comment__head_text'>edited</h4>}
        </div>

        <div className='post__text_container'>
          <p>{text}</p>
        </div>
        <div className='comment__manageboard'>
          <div className='post__likes_comments'>
            <div>
              <i
                onClick={e => likeOrUnlike(_id)}
                className={`fas fa-heart fa-lg${setHeartClass(likes, user)}`}
              ></i>{' '}
              {likes !== undefined && likes.length > 0 && <p>{likes.length}</p>}
            </div>
            <div>
              <i
                className={`fas fa-comment fa-lg${setCommentClass(comments)}`}
                onClick={e => history.push(`/posts/${_id}`)}
              ></i>{' '}
              {comments !== undefined && comments.length > 0 && (
                <p>{comments.length}</p>
              )}
            </div>
          </div>
          <div className='comment__buttons'>
            <Link to={`/posts/${_id}`} className='btn btn-dark'>
              Discussion
            </Link>
            {owner !== null && user === owner._id && (
              <button
                type='button'
                className='btn btn-red'
                onClick={e => toggleModalOpen(!modalOpen)}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.authentication.user._id
})

const mapDispatchToProps = dispatch => ({
  likeOrUnlike: postId => dispatch(likesGenerator(postId)),
  deletePost: postId => dispatch(deletePostGenerator(postId))
})

export default connect(mapStateToProps, mapDispatchToProps)(PostItem)
