import React from 'react'
import { Link } from 'react-router-dom'

const ProfileItem = ({ profile }) => {
  const {
    user: { _id, name, avatar },
    status,
    location,
    company,
    skills
  } = profile

  return (
    <div className='profile bg-light'>
      <img className='round-img' src={avatar} alt='an image of a developer' />
      <div>
        <h2>{name}</h2>
        <p>
          {status} {company && <span>at {company}</span>}
        </p>
        {location && (
          <p className='my-1'>
            <span>{location}</span>
          </p>
        )}
        <Link to={`/profiles/${_id}`} className='btn btn-primary'>
          View profile
        </Link>
      </div>
      <ul>
        {skills.slice(0, 4).map(skill => (
          <li className='text-primary' key={skill}>
            <i className='fas fa-check'></i>
            {skill}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProfileItem

// export default () => <div>profile</div>
