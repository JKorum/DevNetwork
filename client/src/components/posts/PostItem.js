import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import { likesGenerator, deletePostGenerator } from '../../store/actions/post'

const PostItem = ({
  post: { _id, owner, avatar, ownerName, text, createdAt, likes, comments },
  user,
  likeOrUnlike,
  deletePost
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
        <p className='post-date'>
          Posted on <Moment date={createdAt} format='YYYY/MM/DD' />
        </p>

        <button className='btn' onClick={e => likeOrUnlike(_id)}>
          <i className='fas fa-thumbs-up'></i>{' '}
          {likes.length > 0 && <span>{likes.length}</span>}
        </button>

        <Link to={`/posts/${_id}`} className='btn btn-primary'>
          Discussion <span className='comment-count'>{comments.length}</span>
        </Link>
        {/* show delete button only if post belongs to auth user */}
        {owner === user && (
          <button className='btn btn-danger' onClick={e => deletePost(_id)}>
            <i class='fas fa-times'></i>
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
  likeOrUnlike: postId => dispatch(likesGenerator(postId)),
  deletePost: postId => dispatch(deletePostGenerator(postId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostItem)
