import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

export const DashboardActions = () => (
  <Fragment>
    <Link to='/edit-profile' className='btn'>
      <i className='fas fa-user-circle'></i> Edit Profile
    </Link>
    <Link to='/add-experience' className='btn'>
      <i className='fas fa-laptop-code'></i> Add Experience
    </Link>
    <Link to='/add-education' className='btn'>
      <i className='fas fa-graduation-cap'></i> Add Education
    </Link>
  </Fragment>
)
