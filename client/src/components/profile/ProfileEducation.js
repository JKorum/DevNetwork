import React from 'react'
import Moment from 'react-moment'

const ProfileEducation = ({
  education: { school, degree, fieldofstudy, from, to, current, description }
}) => (
  <div>
    <h3>{school}</h3>
    <p>
      <Moment date={from} format='YYYY/MM/DD' /> -{' '}
      {current ? 'till now' : <Moment date={to} format='YYYY/MM/DD' />}
    </p>
    <p>
      <strong>Degree: </strong>
      {degree}
    </p>
    <p>
      <strong>Field of study: </strong>
      {fieldofstudy}
    </p>
    {description && (
      <p className='description'>
        <strong>Description: </strong>
        {description}
      </p>
    )}
  </div>
)

export default ProfileEducation
