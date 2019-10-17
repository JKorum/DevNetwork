import React, { Fragment, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchProfileGenerator } from '../../store/actions/profile'
import Spinner from '../layout/Spinner'

const Dashboard = ({
  loadProfile,
  authentication: { user },
  profile: { loading, profile }
}) => {
  useEffect(() => {
    console.log(`useEffect from <Dashboard /> is fired`)
    loadProfile()
  }, [])

  // if done loading -> render JSX
  // else -> render <Spinner />
  return !loading ? (
    <Fragment>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <Fragment>has profile</Fragment>
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
  )
}

const mapStateToProps = state => ({
  authentication: state.authentication,
  profile: state.profile
})

const mapDispatchToProps = dispatch => ({
  loadProfile: () => dispatch(fetchProfileGenerator())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)
