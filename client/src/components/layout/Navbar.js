import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  logoutUserGenerator,
  logoutAllSessionsGenerator
} from '../../store/actions/auth'

const Navbar = ({ isAuthenticated, loading, logoutUser, logoutAll }) => {
  const authLinks = (
    <ul>
      <li>
        <Link to='/profiles'>Developers</Link>
      </li>
      <li>
        <Link to='/posts'>Posts</Link>
      </li>
      <li>
        <Link to='/dashboard'>
          <i className='fas fa-user'></i>{' '}
          <span className='hide-sm'>Dashboard</span>
        </Link>
      </li>
      <li>
        <Link onClick={logoutUser} to='/'>
          <i className='fas fa-sign-out-alt'></i>{' '}
          <span className='hide-sm'>Logout</span>
        </Link>
      </li>
      <li>
        <Link onClick={logoutAll} to='/'>
          <i className='fas fa-angle-double-right'></i>{' '}
          <span className='hide-sm'>End all sessions</span>
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

  // maybe link to '/' should clear state fields
  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='fas fa-meteor'></i> DevNetwork
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
  logoutUser: () => dispatch(logoutUserGenerator()),
  logoutAll: () => dispatch(logoutAllSessionsGenerator())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar)
