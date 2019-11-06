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
import greetings from '../../utils/greetings'

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

  // temp -->
  const handleDelete = () => {
    if (window.confirm("Are you sure? This action can't be undone")) {
      deleteAccount()
    }
  }

  return (
    <section className='container'>
      {alerts.length > 0 && <Alert />}
      {!loading ? (
        <Fragment>
          <h1 className='large text-primary mx-1'>Dashboard</h1>
          <div className='dashboard-header bg-primary mx-1'>
            <h4>
              {greetings()}, {user && user.name}!
            </h4>
            <div className='dash-buttons'>
              {profile !== null && <DashboardActions userId={user._id} />}
            </div>
          </div>
          <div className='dashboard_main my-1 p-1'>
            {profile !== null ? (
              profile.experience.length > 0 || profile.education.length > 0 ? (
                <div className='dashboard_main__separator'>
                  <div>
                    <ExperienceList experience={profile.experience} />
                  </div>
                  {/* <div className='vertical_line'></div> */}
                  <div>
                    <EducationList education={profile.education} />
                  </div>
                </div>
              ) : (
                <p>No experience & education data provided... </p>
              )
            ) : (
              <p>You haven't created your profile yet...</p>
            )}
          </div>
          <div className='dashboard_manageboard mx-1'>
            {profile !== null ? (
              <button className='btn btn-red' onClick={handleDelete}>
                Delete Account
              </button>
            ) : (
              <Link to='/create-profile' className='btn btn-dark'>
                Create Profile
              </Link>
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
  loadProfile: () => dispatch(fetchProfileGenerator()),
  deleteAccount: () => dispatch(accountDeleteGenerator())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)
