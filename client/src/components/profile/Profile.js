import React, { useEffect, Fragment, useState } from 'react'
import { connect } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import ReactModal from 'react-modal'
import {
  fetchProfileByIdGenerator,
  setImgAndFetchProfileGenerator,
  toggleImgAndFetchProfileGenerator
} from '../../store/actions/profile'
import Spinner from '../layout/Spinner'
import ProfileTop from './ProfileTop'
import ProfileAbout from './ProfileAbout'
import ProfileExperience from './ProfileExperience'
import ProfileEducation from './ProfileEducation'
import ProfileGitRepos from './ProfileGitRepos'
import Alert from '../layout/Alert'

const Profile = ({
  alerts,
  loadProfile,
  setImgAndLoadProfile,
  toggleImgAndLoadProfile,
  profile: { profile, loading },
  authentication: auth
}) => {
  const { user_id } = useParams()

  const [modalOpen, toggleModalOpen] = useState(false)

  useEffect(() => {
    const id = user_id
    loadProfile(id)
  }, [])

  // it will show spinner if would try to view profile of non-existent user -> fix it
  // maybe redirect back to posts and show alert 'profile doesn't exist'
  return (
    <section className='container'>
      {alerts.length > 0 && <Alert />}

      <ReactModal
        isOpen={modalOpen}
        parentSelector={() => document.getElementById('root')}
        appElement={document.getElementById('root')}
        onRequestClose={() => toggleModalOpen(!modalOpen)}
        closeTimeoutMS={200}
        className='modal'
      >
        <h1>Upload Profile Image</h1>
        {/* <div className='line--modal'></div> */}
        <form
          id='img_form'
          onSubmit={e => {
            e.preventDefault()
            if (e.target.url.value !== '') {
              setImgAndLoadProfile(user_id, {
                image: e.target.url.value
              })
            }
            toggleModalOpen(!modalOpen)
          }}
        >
          <p>Please provide URL to an image.</p>
          <p>
            You will be able to switch between the image and the gravatar at any
            time.
          </p>
          <input
            id='url_input'
            name='url'
            type='url'
            required
            placeholder='eg. https://avatars.githubusercontent.com/u/1234'
          />
        </form>
        <div>
          <button type='submit' form='img_form' className='btn modal-red'>
            Submit
          </button>
          <button
            type='button'
            onClick={() => toggleModalOpen(!modalOpen)}
            className='btn modal-primary'
          >
            Cancel
          </button>
        </div>
      </ReactModal>

      {!loading && profile !== null ? (
        <Fragment>
          <div className='container__mini_banner mx-1'>
            <div>
              <Link to='/profiles' className='btn'>
                To Profiles List
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
            </div>
            {!auth.loading &&
              auth.isAuthenticated &&
              auth.user &&
              profile &&
              profile.user &&
              auth.user._id === profile.user._id && (
                <div className='avatar_manageboard'>
                  <button
                    className='btn'
                    onClick={e => toggleModalOpen(!modalOpen)}
                  >
                    Switch Avatar
                  </button>
                  <button
                    className='btn'
                    onClick={e => toggleImgAndLoadProfile(user_id)}
                    disabled={profile.user.useImage === undefined}
                  >
                    Toggle Avatar
                  </button>
                </div>
              )}
          </div>

          <div className='profile-grid m-1'>
            <ProfileTop profile={profile} />
            <ProfileAbout profile={profile} />
            <div className='profile-exp bg-white p-2'>
              <h2 className='text-primary'>Experience</h2>
              {profile.experience !== undefined &&
              profile.experience.length > 0 ? (
                profile.experience.map(exp => (
                  <ProfileExperience key={exp._id} experience={exp} />
                ))
              ) : (
                <h4>No experience data</h4>
              )}
            </div>

            <div className='profile-edu bg-white p-2'>
              <h2 className='text-primary'>Education</h2>
              {profile.education !== undefined &&
              profile.education.length > 0 ? (
                profile.education.map(edu => (
                  <ProfileEducation key={edu._id} education={edu} />
                ))
              ) : (
                <h4>No education data</h4>
              )}
            </div>
            {profile.githubusername && (
              <ProfileGitRepos githubusername={profile.githubusername} />
            )}
          </div>
        </Fragment>
      ) : (
        <Spinner />
      )}
    </section>
  )
}

const mapStateToProps = state => ({
  alerts: state.alerts,
  authentication: state.authentication,
  profile: state.profile
})

const mapDispatchToProps = dispatch => ({
  loadProfile: id => dispatch(fetchProfileByIdGenerator(id)),
  setImgAndLoadProfile: (userId, data) =>
    dispatch(setImgAndFetchProfileGenerator(userId, data)),
  toggleImgAndLoadProfile: userId =>
    dispatch(toggleImgAndFetchProfileGenerator(userId))
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
