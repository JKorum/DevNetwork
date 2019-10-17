import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

const PrivateRoute = ({
  isAuthenticated,
  loading,
  component: Component,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      // if not authenticated and done loading -> redirect to `/login`
      // else -> render component
      !isAuthenticated && !loading ? (
        <Redirect to='/login' />
      ) : (
        <Component {...props} />
      )
    }
  />
)

const mapStateToProps = state => ({
  isAuthenticated: state.authentication.isAuthenticated,
  loading: state.authentication.loading
})

export default connect(mapStateToProps)(PrivateRoute)
