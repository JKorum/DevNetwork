import React, { useState } from 'react'
import { connect } from 'react-redux'
import { addCommentGenerator } from '../../store/actions/post'

const CommentForm = ({ postId, addComment }) => {
  const [text, setText] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    addComment(postId, { text })
  }

  return (
    <form className='form my-1' onSubmit={handleSubmit}>
      <textarea
        name='text'
        cols='30'
        rows='5'
        placeholder='Your comment...'
        value={text}
        onChange={e => setText(e.target.value)}
        required
      ></textarea>
      <input type='submit' value='submit' className='btn btn-dark my-1' />
    </form>
  )
}

const mapDispatchToProps = dispatch => ({
  addComment: (postId, data) => dispatch(addCommentGenerator(postId, data))
})

export default connect(
  null,
  mapDispatchToProps
)(CommentForm)
