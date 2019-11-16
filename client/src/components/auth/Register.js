import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'

import { connect } from 'react-redux'
import { setAlert } from '../../store/actions/alert'
import { registerGenerator } from '../../store/actions/auth'
import Alert from '../layout/Alert'

const Register = ({ setAlert, registerUser, isAuthenticated, alerts }) => {
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
    <section className='container welcome bord-l'>
      {alerts.length > 0 && <Alert />}
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>Create your account</p>
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
            You can use a Gravatar email to set up a profile image<br></br>
            (you can switch it later)
          </small>
          {/* <small className='form-text'>(you can switch it later)</small> */}
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
        <input type='submit' value='Register' className='btn btn-primary' />
      </form>
      <div className='guest_nav my-1'>
        <p>
          Already have an account? <Link to='/login'>Login</Link>
        </p>
      </div>
    </section>
  )
}

const mapStateToProps = state => ({
  isAuthenticated: state.authentication.isAuthenticated,
  alerts: state.alerts
})

const mapDispatchToProps = dispatch => ({
  setAlert: (msg, alertType) => dispatch(setAlert(msg, alertType)),
  registerUser: data => dispatch(registerGenerator(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Register)
