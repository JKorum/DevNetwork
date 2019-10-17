import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />
  }
  return (
    <section className='landing'>
      <div className='dark-overlay'>
        <div className='landing-inner'>
          <h1 className='x-large'>Developer Network ^1.0.0</h1>
          <p className='lead'>
            The place for landing your knowledge portfolio, collaboration and
            fetching feedback
          </p>
          <div className='buttons'>
            <Link to='/register' className='btn btn-primary'>
              Sign Up
            </Link>
            <Link to='/login' className='btn'>
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

const mapStateToProps = state => ({
  isAuthenticated: state.authentication.isAuthenticated
})

export default connect(mapStateToProps)(Landing)
