import React from 'react'
import { Link } from 'react-router-dom'

export const DashboardActions = () => (
  <div className='dash-buttons'>
    <Link to='/edit-profile' className='btn'>
      <i className='fas fa-user-circle text-primary'></i>
      Edit profile
    </Link>
    <Link to='/add-experience' className='btn'>
      <i className='fab fa-black-tie text-primary'></i>
      Add experience
    </Link>
    <Link to='/add-education' className='btn'>
      <i className='fas fa-graduation-cap text-primary'></i>
      Add education
    </Link>
  </div>
)
