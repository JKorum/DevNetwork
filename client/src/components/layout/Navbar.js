import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { logoutUserGenerator } from '../../store/actions/auth'

const Navbar = ({ isAuthenticated, loading, logoutUser }) => {
  const authLinks = (
    <ul>
      <li>
        <Link onClick={logoutUser} to='/'>
          <i className='fas fa-sign-out-alt'></i>{' '}
          <span className='hide-sm'>Logout</span>
        </Link>
      </li>
    </ul>
  )

  const guestLinks = (
    <ul>
      <li>
        <Link to='/profiles'>Developers</Link>
      </li>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  )

  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/dashboard'>
          <i className='fas fa-laptop-code fa-xs'></i>DevNetwork
        </Link>
      </h1>
      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
      )}
    </nav>
  )
}

const mapStateToProps = state => ({
  isAuthenticated: state.authentication.isAuthenticated,
  loading: state.authentication.loading
})

const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch(logoutUserGenerator())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar)
