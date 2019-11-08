import React, { useState } from 'react'
import { connect } from 'react-redux'
import { addCommentGenerator } from '../../store/actions/post'

const CommentForm = ({
  postId,
  addComment,
  avatar,
  comments,
  useImage,
  image
}) => {
  const [text, setText] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    addComment(postId, { text })
    setText('')
  }

  return (
    <div className='comment my-1 p-1'>
      <div className='comment__avatar_container'>
        <div className='img_container--comments'>
          <img src={useImage ? image : avatar} />
        </div>

        {/* <img src={useImage ? image : avatar} className='round-img' /> */}
      </div>
      <div>
        <div className='comment__info--top px-xs'>
          <h4 className='comment__head_text'>
            {comments.length} comments total
          </h4>
        </div>
        <form id='comment_form' className='form' onSubmit={handleSubmit}>
          <textarea
            name='text'
            placeholder='Leave a public comment...'
            value={text}
            onChange={e => setText(e.target.value)}
            className='comment__text_container'
            required
          ></textarea>
        </form>
        <div className='comment__manageboard--top'>
          <input
            type='submit'
            value='Submit'
            className='btn btn-dark'
            form='comment_form'
          />
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  avatar: state.authentication.user.avatar,
  useImage: state.authentication.user.useImage,
  image: state.authentication.user.image,
  comments: state.post.post.comments
})

const mapDispatchToProps = dispatch => ({
  addComment: (postId, data) => dispatch(addCommentGenerator(postId, data))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentForm)
