import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { fetchProfileGenerator } from '../../store/actions/profile'

const Dashboard = ({ loadProfile, authentication, profile }) => {
  useEffect(() => {
    console.log(`useEffect from <Dashboard /> is fired`)
    loadProfile()
  }, [])

  return <div>Dashboard</div>
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
