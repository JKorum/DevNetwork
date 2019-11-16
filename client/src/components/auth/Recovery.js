import React, { useState, useEffect, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link, useLocation, Redirect } from 'react-router-dom'
import Alert from '../layout/Alert'
import {
  sendRecoveryRequestGenerator,
  sendNewPasswordGenerator
} from '../../store/actions/auth'
import { setAlert } from '../../store/actions/alert'

const Recovery = ({
  alerts,
  sendEmail,
  alertPasswordMatch,
  recovery,
  sendPassword
}) => {
  const [token, setToken] = useState(null)
  const { search } = useLocation()

  useEffect(() => {
    if (typeof search === 'string' && search !== '') {
      setToken(search.slice(7))
    }
  }, [])

  const handleSendEmail = e => {
    e.preventDefault()
    sendEmail({ email: e.target.email.value })
  }

  const handleSendPassword = e => {
    e.preventDefault()
    const password = e.target.password.value
    const confirm = e.target.confirm.value
    if (password === confirm) {
      token !== null && sendPassword(token, { password })
    } else {
      alertPasswordMatch()
    }
  }

  return (
    <section className='container welcome bord-l'>
      {alerts.length > 0 && <Alert />}
      {!recovery ? (
        <Fragment>
          <h1 className='large text-primary'>Recover</h1>
          <p className='lead'>
            {token === null
              ? 'Revive your password'
              : 'Come up with a new password'}
          </p>
          <form
            id='recovery-form'
            className='form'
            onSubmit={token === null ? handleSendEmail : handleSendPassword}
          >
            {token === null ? (
              <div className='form-group'>
                <input
                  type='email'
                  name='email'
                  placeholder='developer@gmail.com'
                  autoFocus={true}
                  required
                />
                <small className='form-text'>
                  Enter email you used when registered
                </small>
              </div>
            ) : (
              <Fragment>
                <div className='form-group'>
                  <input
                    type='password'
                    name='password'
                    placeholder='password'
                    minLength='6'
                    autoFocus={true}
                    required
                  />
                </div>
                <div className='form-group'>
                  <input
                    type='password'
                    name='confirm'
                    placeholder='confirm password'
                    minLength='6'
                    required
                  />
                </div>
              </Fragment>
            )}
          </form>
          <div className='guest_nav my-1'>
            <button type='submit' className='btn btn-red' form='recovery-form'>
              Submit
            </button>
            <Link to='/login' className='btn btn-guest'>
              Go Back
            </Link>
          </div>
        </Fragment>
      ) : (
        <Redirect to='/login' />
      )}
    </section>
  )
}

const mapStateToProps = state => ({
  alerts: state.alerts,
  recovery: state.recovery
})

const mapDispatchToProps = dispatch => ({
  sendEmail: data => dispatch(sendRecoveryRequestGenerator(data)),
  sendPassword: (token, data) =>
    dispatch(sendNewPasswordGenerator(token, data)),
  alertPasswordMatch: () =>
    dispatch(setAlert("passwords didn't match", 'danger'))
})

export default connect(mapStateToProps, mapDispatchToProps)(Recovery)
