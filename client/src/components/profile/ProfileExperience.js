import React from 'react'
import Moment from 'react-moment'

const ProfileExperience = ({
  experience: { title, company, location, description, from, to, current }
}) => (
  <div>
    <h3>
      {company} {location && <span>/ {location}</span>}
    </h3>
    <p>
      <Moment data={from} format='YYYY/MM/DD' /> -{' '}
      {current ? 'till now' : <Moment date={to} format='YYYY/MM/DD' />}
    </p>
    <p>
      <strong>Position: </strong>
      {title}
    </p>
    {description && (
      <p className='description'>
        <strong>Description: </strong>
        {description}
      </p>
    )}
  </div>
)

export default ProfileExperience
