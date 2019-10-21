import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { deleteCommentGenerator } from '../../store/actions/post'

// add sorting comments by createdAt -> most resent on top (change back end)
const CommentItem = ({
  comment: { _id, owner, avatar, ownerName, text },
  deleteComment,
  user,
  postId
}) => {
  return (
    <div className='post bg-white my-1 p-1'>
      <div>
        <Link to={`/profiles/${owner}`}>
          <img className='round-img my-1' src={avatar} />
          <h4>{ownerName}</h4>
        </Link>
      </div>
      <div>
        <p className='my-1'>{text}</p>
        {user === owner && (
          <button
            type='button'
            className='btn btn-danger'
            onClick={e => deleteComment(postId, _id)}
          >
            <i className='fas fa-times'></i>
          </button>
        )}
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.authentication.user._id
})

const mapDispatchToProps = dispatch => ({
  deleteComment: (postId, commentId) =>
    dispatch(deleteCommentGenerator(postId, commentId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentItem)
