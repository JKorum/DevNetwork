import React, { Fragment, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  fetchProfileGenerator,
  accountDeleteGenerator
} from '../../store/actions/profile'
import Spinner from '../layout/Spinner'
import { DashboardActions } from '../dashboard/DashboardActions'
import ExperienceList from './ExperienceList'
import EducationList from './EducationList'
import Alert from '../layout/Alert'

const Dashboard = ({
  alerts,
  loadProfile,
  deleteAccount,
  authentication: { user },
  profile: { loading, profile }
}) => {
  useEffect(() => {
    console.log(`useEffect from <Dashboard /> is fired`)
    loadProfile()
  }, [])

  const handleDelete = () => {
    if (window.confirm("Are you sure? This action can't be undone")) {
      deleteAccount()
    }
  }

  // if done loading -> render JSX
  // else -> render <Spinner />
  return (
    <section className='container'>
      {alerts.length > 0 && <Alert />}
      {!loading ? (
        <Fragment>
          <h1 className='large text-primary'>Dashboard</h1>
          <p className='lead'>
            <i className='fas fa-user'></i> Welcome, {user && user.name}!
          </p>
          {profile !== null ? (
            <Fragment>
              <DashboardActions />
              <ExperienceList experience={profile.experience} />
              <EducationList education={profile.education} />
              <div className='my-2'>
                <button className='btn btn-danger' onClick={handleDelete}>
                  <i className='fas fa-user-minus'></i> Delete my account
                </button>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <p>Your profile is not setup yet</p>
              <Link to='/create-profile' className='btn btn-primary my-1'>
                Create profile
              </Link>
            </Fragment>
          )}
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
  loadProfile: () => dispatch(fetchProfileGenerator()),
  deleteAccount: () => dispatch(accountDeleteGenerator())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)
