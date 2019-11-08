import React, { useState } from 'react'
import { connect } from 'react-redux'
import { addPostGenerator } from '../../store/actions/post'

const PostForm = ({ addPost, image, postsNumber }) => {
  const [text, setText] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    addPost({ text })
    setText('')
  }

  return (
    <div className='post my-1 p-1'>
      <div className='post__avatar_container'>
        <div className='img_container--posts'>
          <img src={image} />
        </div>
        {/* <img className='round-img' src={image} /> */}
      </div>

      <div>
        <div className='comment__info--top px-xs'>
          <h4 className='comment__head_text'>{postsNumber} posts total</h4>
        </div>
        <form id='post_form' className='form' onSubmit={handleSubmit}>
          <textarea
            name='text'
            placeholder='Create a post...'
            value={text}
            onChange={e => setText(e.target.value)}
            className='post__text_container'
            required
          ></textarea>
        </form>
        <div className='comment__manageboard--top'>
          <input
            type='submit'
            value='Submit'
            className='btn btn-dark'
            form='post_form'
          />
        </div>
      </div>
    </div>
  )
}

const mapDispatchToProps = dispatch => ({
  addPost: text => dispatch(addPostGenerator(text))
})

export default connect(
  null,
  mapDispatchToProps
)(PostForm)
