import React from 'react'
import { Link } from 'react-router-dom'

const Landing = () => (
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

export default Landing
