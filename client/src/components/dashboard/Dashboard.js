import React, { Fragment, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ReactModal from 'react-modal'
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
  const [modalOpen, toggleModalOpen] = useState(false)

  useEffect(() => {
    console.log(`useEffect from <Dashboard /> is fired`)
    loadProfile()
  }, [])

  return (
    <section className='container'>
      {alerts.length > 0 && <Alert />}

      <ReactModal
        isOpen={modalOpen}
        parentSelector={() => document.getElementById('root')}
        appElement={document.getElementById('root')}
        onRequestClose={() => toggleModalOpen(!modalOpen)}
        closeTimeoutMS={200}
        style={{
          content: {
            top: '30%',
            bottom: '30%',
            right: '30%',
            left: '30%',
            borderRadius: '5px',
            border: '1px solid #17a2b8',
            background: '#343a40'
          }
        }}
      >
        <h1>Confirm Account Deletion</h1>

        <form
          id='delete_form'
          onSubmit={e => {
            e.preventDefault()
            if (e.target.delete.value.toLowerCase() === 'delete my account') {
              toggleModalOpen(!modalOpen)
              deleteAccount()
            }
          }}
        >
          <p>
            To permanently delete your personal data enter 'Delete my account'.
          </p>
          <p>Please note that your posts and comments will be preserved.</p>
          <input
            name='delete'
            type='text'
            required
            placeholder='delete my account...'
          />
        </form>
        <div>
          <button type='submit' form='delete_form' className='btn modal-red'>
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

      {!loading && profile ? (
        <Fragment>
          <h1 className='large text-primary mx-1'>Dashboard</h1>
          <div className='dashboard-header bg-primary mx-1'>
            <h4 className='dashboard-greeting'>
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
              <button
                className='btn btn-red'
                onClick={e => toggleModalOpen(!modalOpen)}
              >
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
