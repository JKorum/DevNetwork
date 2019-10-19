import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { fetchProfileByIdGenerator } from '../../store/actions/profile'
import Spinner from '../layout/Spinner'
import ProfileTop from './ProfileTop'
import ProfileAbout from './ProfileAbout'
import ProfileExperience from './ProfileExperience'
import ProfileEducation from './ProfileEducation'
import ProfileGitRepos from './ProfileGitRepos'

const Profile = ({
  loadProfile,
  profile: { profile, loading },
  authentication: auth
}) => {
  const { user_id } = useParams()

  useEffect(() => {
    loadProfile(user_id)
  }, [])

  return !loading && profile !== null ? (
    <section className='container'>
      <Link to='/profiles' className='btn'>
        Back to profiles
      </Link>
      {/* i don't like syntax -> */}
      {!auth.loading &&
        auth.isAuthenticated &&
        auth.user &&
        profile &&
        profile.user &&
        auth.user._id === profile.user._id && (
          <Link to='/edit-profile' className='btn btn-dark'>
            Edit profile
          </Link>
        )}
      <div className='profile-grid my-1'>
        <ProfileTop profile={profile} />
        <ProfileAbout profile={profile} />
        <div className='profile-exp bg-white p-2'>
          <h2 className='text-primary'>Experiences</h2>
          {profile.experience.length > 0 ? (
            profile.experience.map(exp => (
              <ProfileExperience key={exp._id} experience={exp} />
            ))
          ) : (
            <h4>No experience credentials</h4>
          )}
        </div>
        <div className='profile-edu bg-white p-2'>
          <h2 className='text-primary'>Education</h2>
          {profile.education.length > 0 ? (
            profile.education.map(edu => (
              <ProfileEducation key={edu._id} education={edu} />
            ))
          ) : (
            <h4>No education credentials</h4>
          )}
        </div>
        {profile.githubusername && (
          <ProfileGitRepos githubusername={profile.githubusername} />
        )}
      </div>
    </section>
  ) : (
    <Spinner />
  )
}

const mapStateToProps = state => ({
  authentication: state.authentication,
  profile: state.profile
})

const mapDispatchToProps = dispatch => ({
  loadProfile: id => dispatch(fetchProfileByIdGenerator(id))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile)
