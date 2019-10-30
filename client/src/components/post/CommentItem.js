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
  comment: {
    _id,
    owner,
    avatar,
    ownerName,
    text,
    createdAt,
    likes,
    wasUpdated
  },
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
        <img className='round-img' src={avatar} />
      </div>
      <div>
        <div className='comment__info px-xs'>
          <span>
            <Link to={`/profiles/${owner}`}>
              <h4 className={user === owner ? 'user_comment' : 'void'}>
                {ownerName}
              </h4>
            </Link>
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
            <input
              type='text'
              value={commentText}
              onChange={handleCommentChange}
              autoFocus={true}
            />
          )}
        </div>

        <div className='comment__manageboard'>
          <div className='comment__likes'>
            <i
              className={`fas fa-heart fa-lg${setHeartClass(likes, user)}`}
              onClick={handleLikeComment}
            ></i>{' '}
            {likes.length > 0 && <p>{likes.length}</p>}
          </div>
          <div className='comment__buttons'>
            {user === owner && (
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentItem)
