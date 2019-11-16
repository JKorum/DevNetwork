import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

export const DashboardActions = ({ userId }) => (
  <Fragment>
    <Link to={`/profiles/${userId}`} className='btn btn-primary'>
      <i className='fas fa-eye'></i>{' '}
      <span className='dash-hide'>View Public Profile</span>
    </Link>
    <Link to='/edit-profile' className='btn btn-primary'>
      <i className='fas fa-pen-fancy'></i>{' '}
      <span className='dash-hide'>Edit Profile</span>
    </Link>
    <Link to='/add-experience' className='btn btn-primary'>
      <i className='fab fa-js'></i>{' '}
      <span className='dash-hide'>Add Experience</span>
    </Link>
    <Link to='/add-education' className='btn btn-primary'>
      <i className='fas fa-code'></i>{' '}
      <span className='dash-hide'>Add Education</span>
    </Link>
  </Fragment>
)
