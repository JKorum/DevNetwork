import React, { Fragment, useState } from 'react'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  deleteCommentGenerator,
  likeCommentGenerator,
  updateCommentTextGenerator
} from '../../store/actions/post'
import setHeartClass from '../../utils/setHeartClass'

const CommentItem = ({
  comment: { _id, owner, ownerName, text, createdAt, likes, wasUpdated },
  deleteComment,
  updateComment,
  likeComment,
  user,
  postId
}) => {
  const [waitForUpdate, setWaitForUpdate] = useState(false)
  const [commentText, setCommentText] = useState(text)

  const handleLikeComment = e => {
    likeComment(postId, _id)
  }

  const handleCommentChange = e => {
    setCommentText(e.target.value)
  }

  const handleSubmit = e => {
    setWaitForUpdate(false)
    updateComment(postId, _id, commentText)
  }

  return (
    <div className='comment my-1 p-1'>
      <div className='comment__avatar_container'>
        {owner !== null && owner !== undefined ? (
          <div className='img_container--comments'>
            <img src={owner.useImage ? owner.image : owner.avatar} />
          </div>
        ) : (
          <div className='img_container--comments'>
            <img src='https://www.gravatar.com/avatar/HASH?s=200&d=retro' />
          </div>
        )}
      </div>
      <div>
        <div className='comment__info px-xs'>
          <span>
            {owner !== null && owner !== undefined ? (
              <Link to={`/profiles/${owner._id}`} title={'view public profile'}>
                <h4 className={user === owner._id ? 'user_comment' : 'void'}>
                  {ownerName}
                </h4>
              </Link>
            ) : (
              <a title={'non-existent user'} style={{ cursor: 'default' }}>
                <h4>{ownerName}</h4>
              </a>
            )}
            <h4 className='comment__head_text mxl-xs'>
              <Moment date={createdAt} fromNow={true} />
            </h4>
          </span>
          {wasUpdated && <h4 className='comment__head_text'>edited</h4>}
        </div>
        <div className='comment__text_container'>
          {!waitForUpdate ? (
            <p>{text}</p>
          ) : (
            <textarea
              value={commentText}
              onChange={handleCommentChange}
              autoFocus={true}
            ></textarea>
            // <input
            //   type='text'
            //   value={commentText}
            //   onChange={handleCommentChange}
            //   autoFocus={true}
            // />
          )}
        </div>

        <div className='comment__manageboard'>
          <div className='comment__likes'>
            <i
              className={`fas fa-heart fa-lg${setHeartClass(likes, user)}`}
              onClick={handleLikeComment}
            ></i>{' '}
            {likes !== undefined && likes.length > 0 && <p>{likes.length}</p>}
          </div>
          <div className='comment__buttons'>
            {owner !== null && owner !== undefined && user === owner._id && (
              <Fragment>
                <button
                  type='button'
                  className='btn btn-dark'
                  onClick={
                    !waitForUpdate ? e => setWaitForUpdate(true) : handleSubmit
                  }
                >
                  {!waitForUpdate ? 'Update' : 'Submit'}
                </button>
                <button
                  type='button'
                  className='btn btn-red'
                  onClick={
                    !waitForUpdate
                      ? e => deleteComment(postId, _id)
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
  )
}

const mapStateToProps = state => ({
  user: state.authentication.user._id
})

const mapDispatchToProps = dispatch => ({
  deleteComment: (postId, commentId) =>
    dispatch(deleteCommentGenerator(postId, commentId)),
  likeComment: (postId, commentId) =>
    dispatch(likeCommentGenerator(postId, commentId)),
  updateComment: (postId, commentId, data) =>
    dispatch(updateCommentTextGenerator(postId, commentId, data))
})

export default connect(mapStateToProps, mapDispatchToProps)(CommentItem)
