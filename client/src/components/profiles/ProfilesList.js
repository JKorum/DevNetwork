import React, { Fragment, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { fetchAllProfilesGenerator } from '../../store/actions/profile'
import Spinner from '../layout/Spinner'
import ProfileItem from './ProfileItem'
import Alert from '../layout/Alert'
import { setAlert } from '../../store/actions/alert'

const ProfilesList = ({
  alerts,
  loadProfiles,
  profiles,
  isLoading,
  fireAlert
}) => {
  const [localProfiles, setLocalProfiles] = useState([])
  const [filteredProfiles, setFilteredProfiles] = useState([])
  const [strictStatus, setStrictStatus] = useState(false)

  useEffect(() => {
    loadProfiles()
  }, [])

  useEffect(() => {
    // local profiles are always sync with global state
    // they are used to produce filtered profiles
    setLocalProfiles(profiles)
    if (profiles.length > 0) {
      setFilteredProfiles(profiles)
    }
  }, [profiles])

  useEffect(() => {
    if (strictStatus) {
      fireAlert('strict mode enabled')
    }
  }, [strictStatus])

  //dev skill set should include some of query skills
  const regularSearch = e => {
    const input = e.target.value.split(',').map(item => item.trim())

    const filtered = []
    for (let i = 0, n = localProfiles.length; i < n; i++) {
      for (let j = 0, l = input.length; j < l; j++) {
        localProfiles[i].skills.forEach(skill => {
          if (skill.toLowerCase().includes(input[j].toLowerCase())) {
            if (filtered.length === 0) {
              filtered.push(localProfiles[i])
            } else {
              // check if profile is already in `filtered`
              const index = filtered.findIndex(profile => {
                return profile._id === localProfiles[i]._id
              })
              if (index === -1) {
                filtered.push(localProfiles[i])
              }
            }
          }
        })
      }
    }

    setFilteredProfiles(filtered)
  }

  //dev skill set must include all query skills
  const strictSearch = e => {
    const input = e.target.value.split(',').map(item => item.trim())
    const filtered = JSON.parse(JSON.stringify(localProfiles))
    const temp = []

    filtered.forEach((profile, index) => {
      temp.push([index, profile.skills.join()])
    })

    for (let i = 0, n = temp.length; i < n; i++) {
      for (let j = 0, l = input.length; j < l; j++) {
        if (!temp[i][1].toLowerCase().includes(input[j].toLowerCase())) {
          filtered[i].delete = true
        }
      }
    }
    const result = filtered.filter(dev => dev.delete !== true)
    setFilteredProfiles(result)
  }

  const $input = document.getElementById('skill-filter')

  return (
    <section className='container'>
      {alerts.length > 0 && <Alert />}
      {!isLoading ? (
        <Fragment>
          <h1 className='large text-primary mx-1'>Developers</h1>
          <div className='developers-header bg-primary mx-1'>
            <h4>Search by</h4>
            <input
              id='skill-filter'
              type='text'
              placeholder='skills /CSV/...'
              onChange={strictStatus ? strictSearch : regularSearch}
              title='Note that filter result will include developers based on their skills that may be partly displayed on cards below'
            />
            <h4>{strictStatus ? 'Strict mode' : 'Use strict'}</h4>
            <i
              className={`fas fa-chevron-circle-right fa-lg ${
                strictStatus ? 'strict' : 'void'
              }`}
              onClick={e => {
                setStrictStatus(!strictStatus)
                setFilteredProfiles(localProfiles)
                $input.value = ''
              }}
              title='In strict mode search result will include developers whose skills satisfy query completely'
            ></i>
          </div>

          <div className='profiles my-1 p-1'>
            {filteredProfiles.length > 0 ? (
              filteredProfiles.map(profile => (
                <ProfileItem key={profile._id} profile={profile} />
              ))
            ) : (
              <div className='filter_results'>
                <h4>No profiles found</h4>
              </div>
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
  loadProfiles: () => dispatch(fetchAllProfilesGenerator()),
  fireAlert: (msg, alertType) => dispatch(setAlert(msg, alertType))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfilesList)
