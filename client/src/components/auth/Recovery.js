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
    <section className='container welcome'>
      {alerts.length > 0 && <Alert />}
      {!recovery ? (
        <Fragment>
          <h1 className='large text-primary mx-1'>Password recovery</h1>
          <div className='recovery-header bg-white mx-1'>
            <h4>
              {token === null
                ? 'Enter your registered email to get a recovery link'
                : 'Come up with a new password'}
            </h4>
          </div>

          <form
            id='recovery-form'
            className='recovery-main'
            onSubmit={token === null ? handleSendEmail : handleSendPassword}
          >
            {token === null ? (
              <input
                type='email'
                name='email'
                placeholder='eg. developer@gmail.com...'
                autoFocus={true}
                required
              />
            ) : (
              <Fragment>
                <input
                  type='password'
                  name='password'
                  placeholder='password'
                  minLength='6'
                  autoFocus={true}
                  required
                />
                <input
                  type='password'
                  name='confirm'
                  placeholder='confirm password'
                  minLength='6'
                  required
                />
              </Fragment>
            )}
          </form>

          <div className='recovery-manageboard mx-1'>
            <div>
              <button
                type='submit'
                className='btn btn-red'
                form='recovery-form'
              >
                Submit
              </button>
              <Link to='/login' className='btn'>
                Go Back
              </Link>
            </div>
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
