import React, { Fragment } from 'react'

const ProfileAbout = ({ profile }) => {
  const {
    user: { name },
    bio,
    skills
  } = profile
  return (
    <div className='profile-about bg-light p-2'>
      {bio && (
        <Fragment>
          <h2 className='text-primary'>{name.trim().split(' ')[0]}'s Bio</h2>
          <p>{bio}</p>
          <div className='line'></div>
        </Fragment>
      )}
      <h2 className='text-primary'>Skill Set</h2>
      <div className='skills'>
        {skills.map(skill => (
          <div className='p-1' key={skill}>
            <i className='fas fa-check'></i>
            {skill}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProfileAbout
