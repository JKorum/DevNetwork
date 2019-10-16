import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'

import { connect } from 'react-redux'
import { setAlert } from '../../store/actions/alert'
import { registerGenerator } from '../../store/actions/auth'

const Register = ({ setAlert, registerUser, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  })

  const { name, email, password, passwordConfirm } = formData

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (password === passwordConfirm) {
      console.log('passwords matched')
      registerUser({ name, email, password })
    } else {
      console.log("passwords don't match")
      setAlert("passwords don't match", 'danger')
    }
  }

  if (isAuthenticated) {
    return <Redirect to='dashboard' />
  }

  return (
    <section className='container'>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user'></i>Create your account
      </p>
      <form className='form' onSubmit={handleSubmit}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='name'
            minLength='2'
            name='name'
            value={name}
            onChange={handleChange}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='email'
            name='email'
            value={email}
            onChange={handleChange}
          />
          <small className='form-text'>
            Use a Gravatar email if you want a profile image
          </small>
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='password'
            minLength='6'
            name='password'
            value={password}
            onChange={handleChange}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='confirm password'
            minLength='6'
            name='passwordConfirm'
            value={passwordConfirm}
            onChange={handleChange}
            required
          />
        </div>
        <input type='submit' value='register' className='btn btn-primary' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Login</Link>
      </p>
    </section>
  )
}

const mapStateToProps = state => ({
  isAuthenticated: state.authentication.isAuthenticated
})

const mapDispatchToProps = dispatch => ({
  setAlert: (msg, alertType) => dispatch(setAlert(msg, alertType)),
  registerUser: data => dispatch(registerGenerator(data))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Register)
