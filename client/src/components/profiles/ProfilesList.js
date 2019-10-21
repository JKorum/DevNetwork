import React, { Fragment, useEffect } from 'react'
import { connect } from 'react-redux'
import { fetchAllProfilesGenerator } from '../../store/actions/profile'
import Spinner from '../layout/Spinner'
import ProfileItem from './ProfileItem'
import Alert from '../layout/Alert'

const ProfilesList = ({ alerts, loadProfiles, profiles, isLoading }) => {
  useEffect(() => {
    loadProfiles()
  }, [])

  return (
    <section className='container'>
      {alerts.length > 0 && <Alert />}
      {!isLoading ? (
        <Fragment>
          <h1 className='large text-primary'>Developers</h1>
          <p className='lead'>
            <i className='fab fa-connectdevelop'></i> Browse and collaborate
            with developers
          </p>
          <div className='profiles'>
            {profiles.length > 0 ? (
              profiles.map(profile => (
                <ProfileItem key={profile._id} profile={profile} />
              ))
            ) : (
              <h4>No profiles found</h4>
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
  profiles: state.profile.profiles,
  isLoading: state.profile.loading
})

const mapDispatchToProps = dispatch => ({
  loadProfiles: () => dispatch(fetchAllProfilesGenerator())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfilesList)
