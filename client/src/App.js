import React, { Fragment, useEffect } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'

import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Register from './components/auth/Register'
import Login from './components/auth/Login'

import store from './store/store'

import { loadUserGenerator } from './store/actions/auth'
import Dashboard from './components/dashboard/Dashboard'
import CreateProfile from './components/profile_forms/CreateProfile'
import EditProfile from './components/profile_forms/EditProfile'
import AddExperience from './components/profile_forms/AddExperience'
import AddEducation from './components/profile_forms/AddEducation'
import PrivateRoute from './components/routing/PrivateRoute'
import ProfilesList from './components/profiles/ProfilesList'
import Profile from './components/profile/Profile'
import Posts from './components/posts/Posts'
import Post from './components/post/Post'

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
          <Switch>
            <Route path='/login' exact={true}>
              <Login />
            </Route>
            <Route path='/register' exact={true}>
              <Register />
            </Route>
            <Route path='/profiles' exact={true}>
              <ProfilesList />
            </Route>
            <Route path='/profiles/:user_id' exact={true}>
              <Profile />
            </Route>
            <PrivateRoute
              path='/dashboard'
              exact={true}
              component={Dashboard}
            />
            <PrivateRoute
              path='/create-profile'
              exact={true}
              component={CreateProfile}
            />
            <PrivateRoute
              path='/edit-profile'
              exact={true}
              component={EditProfile}
            />
            <PrivateRoute
              path='/add-experience'
              exact={true}
              component={AddExperience}
            />
            <PrivateRoute
              path='/add-education'
              exact={true}
              component={AddEducation}
            />
            <PrivateRoute path='/posts' exact={true} component={Posts} />
            <PrivateRoute
              path='/posts/:post_id'
              exact={true}
              component={Post}
            />
          </Switch>
        </Fragment>
      </BrowserRouter>
    </Provider>
  )
}

export default App
