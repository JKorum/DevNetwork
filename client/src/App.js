import React, { Fragment } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'

import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Alert from './components/layout/Alert'

import store from './store/store'

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Fragment>
        <Navbar />
        <Route path='/' exact={true} component={Landing} />
        <Alert />
        <Switch>
          <Route path='/login' exact={true} component={Login} />
          <Route path='/register' exact={true} component={Register} />
        </Switch>
      </Fragment>
    </BrowserRouter>
  </Provider>
)

export default App
