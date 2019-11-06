import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

export const DashboardActions = ({ userId }) => (
  <Fragment>
    <Link to={`/profiles/${userId}`} className='btn btn-primary'>
      <i className='fas fa-eye'></i> View Public Profile
    </Link>
    <Link to='/edit-profile' className='btn btn-primary'>
      <i className='fas fa-pen-fancy'></i> Edit Profile
    </Link>
    <Link to='/add-experience' className='btn btn-primary'>
      <i className='fab fa-js'></i> Add Experience
    </Link>
    <Link to='/add-education' className='btn btn-primary'>
      <i className='fas fa-code'></i> Add Education
    </Link>
  </Fragment>
)
