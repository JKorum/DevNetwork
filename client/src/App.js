import React, { Fragment, useEffect } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'

import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Alert from './components/layout/Alert'

import store from './store/store'

import { loadUserGenerator } from './store/actions/auth'
import Dashboard from './components/dashboard/Dashboard'
import PrivateRoute from './components/routing/PrivateRoute'

const App = () => {
  //will run after component is rendered -> when first load the app & after each browser refresh
  useEffect(() => {
    console.log('useEffect from <App /> is fired')
    store.dispatch(loadUserGenerator())
  }, [])

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Fragment>
          <Navbar />
          <Route path='/' exact={true} component={Landing} />
          <Alert />
          <Switch>
            <Route path='/login' exact={true}>
              <Login />
            </Route>
            <Route path='/register' exact={true}>
              <Register />
            </Route>
            <PrivateRoute
              path='/dashboard'
              exact={true}
              component={Dashboard}
            />
          </Switch>
        </Fragment>
      </BrowserRouter>
    </Provider>
  )
}

export default App
