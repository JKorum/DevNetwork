import React, { useState } from 'react'
import { connect } from 'react-redux'
import { addPostGenerator } from '../../store/actions/post'

const PostForm = ({ addPost }) => {
  const [text, setText] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    addPost({ text })
    setText('')
  }

  return (
    <form className='form my-1' onSubmit={handleSubmit}>
      <textarea
        name='text'
        cols='30'
        rows='5'
        placeholder='Create a post'
        value={text}
        onChange={e => setText(e.target.value)}
        required
      ></textarea>
      <input type='submit' value='submit' className='btn btn-dark my-1' />
    </form>
  )

  return (
    <div className='post-form'>
      <div className='post-form-header bg-primary'>
        <h3>Say something...</h3>
      </div>
      <form className='form my-1' onSubmit={handleSubmit}>
        <textarea
          name='text'
          cols='30'
          rows='5'
          placeholder='Create a post'
          value={text}
          onChange={e => setText(e.target.value)}
          required
        ></textarea>
        <input type='submit' value='submit' className='btn btn-dark my-1' />
      </form>
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
