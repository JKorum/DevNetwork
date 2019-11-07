import React from 'react'
import { Link } from 'react-router-dom'

const ProfileItem = ({ profile }) => {
  const {
    user: { _id, name, avatar, useImage, image },
    status,
    location,
    company,
    skills
  } = profile

  return (
    <div className='profile'>
      <img className='round-img' src={useImage ? image : avatar} />
      <div className='profile__summary'>
        <div>
          <h2>{name}</h2>
          <p>
            {status} {company && <span>at {company}</span>}
          </p>
          {location && (
            <p className='my-1'>
              <span>{location}</span> <i className='fas fa-map-pin'></i>
            </p>
          )}
        </div>

        <Link to={`/profiles/${_id}`} className='btn btn-primary'>
          View Profile
        </Link>
      </div>
      <ul className='profile__skills'>
        {skills.slice(0, 4).map((skill, index) => (
          <li className='skill_item ' key={index}>
            <i className='fas fa-fire-alt'></i> {skill}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProfileItem

// export default () => <div>profile</div>
