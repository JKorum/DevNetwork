import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import video from '../../media/background.mp4'

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />
  }
  return (
    <section className='landing'>
      <div className='dark-overlay'>
        <video src={video} autoPlay loop muted></video>

        <div className='landing-inner'>
          <h1 className='x-large'>Developer Network ^1.0.6</h1>
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

{
  /* <section className='landing'>
      <div className='dark-overlay'>
        <video src={video}></video>

        <div className='landing-inner'>
          <h1 className='x-large'>Developer Network ^1.0.2</h1>
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
    </section> */
}
