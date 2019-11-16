import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'

import { connect } from 'react-redux'
import { loginUserGenerator } from '../../store/actions/auth'

import Alert from '../layout/Alert'

const Login = ({ loginUser, isAuthenticated, alerts }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const { email, password } = formData

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    console.log('handleSubmit is fired')
    loginUser(formData)
  }

  // render <Redirect /> will redirect to specified location
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />
  }

  return (
    <section className='container welcome bord-l'>
      {alerts.length > 0 && <Alert />}

      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'>Login to your account</p>
      <form className='form' onSubmit={handleSubmit}>
        <div className='form-group'>
          <input
            type='email'
            placeholder='email'
            name='email'
            value={email}
            onChange={handleChange}
          />
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
        <input type='submit' value='Login' className='btn btn-primary' />
      </form>
      <div className='guest_nav my-1'>
        <p>
          Don't have an account? <Link to='/register'>Sign Up</Link>
        </p>
        <p>
          Forgot password? <Link to='/recovery'>Recover</Link>
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
  loginUser: data => dispatch(loginUserGenerator(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
