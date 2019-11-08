import React, { Fragment, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  editProfileGenerator,
  fetchProfileGenerator
} from '../../store/actions/profile'
import Spinner from '../layout/Spinner'
import formFiller from '../../utils/formFiller'
import Alert from '../layout/Alert'

const EditProfile = ({
  editProfile,
  profile,
  loading,
  loadProfile,
  alerts
}) => {
  const [formData, setFormData] = useState({
    status: '',
    company: '',
    website: '',
    location: '',
    skills: '',
    githubusername: '',
    bio: '',
    twitter: '',
    facebook: '',
    linkedin: '',
    instagram: '',
    youtube: ''
  })

  const [displaySocialInputs, toggleSocialInputs] = useState(false)

  const {
    status,
    company,
    website,
    location,
    skills,
    githubusername,
    bio,
    twitter,
    facebook,
    linkedin,
    instagram,
    youtube
  } = formData

  useEffect(() => {
    // in case of hard refresh while on `/edit-profile`
    if (!profile) {
      console.log('hard refresh -> fetching profile')
      loadProfile()
    }
    // prefill form fields
    if (profile && !loading) {
      const data = formFiller(profile)
      setFormData({
        ...formData,
        ...data
      })
    }
  }, [profile])

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    // filter data -> server validation don't allow empty strings in optional fields
    // maybe -> need implement complex solution
    const filtered = {}
    Object.entries(formData).forEach(item => {
      if (formData[item[0]]) {
        filtered[item[0]] = item[1]
      }
    })
    editProfile(filtered)
  }

  return (
    <section className='container'>
      {alerts.length > 0 && <Alert />}
      {!loading && profile ? (
        <Fragment>
          <h1 className='large text-primary mx-1'>Edit your profile</h1>
          <div className='dashboard-header bg-primary mx-1'>
            <h4 className='dashboard-greeting'>
              Provide data to make your profile special
            </h4>
          </div>

          <div className='dashboard_main my-1 p-1'>
            <small>* required fields</small>
            <form id='edit_form' className='form' onSubmit={handleSubmit}>
              <div className='form-group'>
                <select
                  name='status'
                  value={status}
                  onChange={handleChange}
                  required
                >
                  <option value=''>* Select professional status</option>
                  <option value='Junior developer'>Junior developer</option>
                  <option value='Developer'>Developer</option>
                  <option value='Senior developer'>Senior developer</option>
                  <option value='Manager'>Manager</option>
                  <option value='Learner'>Learner</option>
                  <option value='Teacher'>Teacher</option>
                  <option value='Intern'>Intern</option>
                  <option value='Other'>Other</option>
                </select>
                <small className='form-text'>
                  Where you are at in your career?
                </small>
              </div>
              <div className='form-group'>
                <input
                  type='text'
                  placeholder='Company'
                  name='company'
                  value={company}
                  onChange={handleChange}
                />
                <small className='form-text'>
                  Could be your own company or one you work for
                </small>
              </div>
              <div className='form-group'>
                <input
                  type='text'
                  placeholder='Website'
                  name='website'
                  value={website}
                  onChange={handleChange}
                />
                <small className='form-text'>
                  Could be your own or a company website
                </small>
              </div>
              <div className='form-group'>
                <input
                  type='text'
                  placeholder='Location'
                  name='location'
                  value={location}
                  onChange={handleChange}
                />
                <small className='form-text'>
                  City & area suggested (eg. Zandvoort, Netherlands)
                </small>
              </div>
              <div className='form-group'>
                <input
                  type='text'
                  placeholder='* Skills'
                  name='skills'
                  value={skills}
                  onChange={handleChange}
                  required
                />
                <small className='form-text'>
                  Please use comma separated values (eg.
                  JavaScript,Typescript,HTML,CSS)
                </small>
              </div>
              <div className='form-group'>
                <input
                  type='text'
                  placeholder='Github Username'
                  name='githubusername'
                  value={githubusername}
                  onChange={handleChange}
                />
                <small className='form-text'>
                  If you want your latest repos and a Github link, include your
                  username
                </small>
              </div>
              <div className='form-group'>
                <textarea
                  type='text'
                  placeholder='A short bio'
                  name='bio'
                  value={bio}
                  onChange={handleChange}
                ></textarea>
                <small className='form-text'>Tell a little about youself</small>
              </div>
              <div className='my-2'>
                <button
                  onClick={() => toggleSocialInputs(!displaySocialInputs)}
                  type='button'
                  className='btn btn-light'
                >
                  Add social networks links
                </button>
                <span>Optional</span>
              </div>
              {displaySocialInputs && (
                <Fragment>
                  <div className='form-group social-input'>
                    <i className='fab fa-twitter-square fa-2x'></i>
                    <input
                      type='text'
                      placeholder='Twitter URL'
                      name='twitter'
                      value={twitter}
                      onChange={handleChange}
                    />
                  </div>
                  <div className='form-group social-input'>
                    <i className='fab fa-facebook fa-2x'></i>
                    <input
                      type='text'
                      placeholder='Facebook URL'
                      name='facebook'
                      value={facebook}
                      onChange={handleChange}
                    />
                  </div>
                  <div className='form-group social-input'>
                    <i className='fab fa-linkedin fa-2x'></i>
                    <input
                      type='text'
                      placeholder='Linkedin URL'
                      name='linkedin'
                      value={linkedin}
                      onChange={handleChange}
                    />
                  </div>
                  <div className='form-group social-input'>
                    <i className='fab fa-instagram fa-2x'></i>
                    <input
                      type='text'
                      placeholder='Instagram URL'
                      name='instagram'
                      value={instagram}
                      onChange={handleChange}
                    />
                  </div>
                  <div className='form-group social-input'>
                    <i className='fab fa-youtube fa-2x'></i>
                    <input
                      type='text'
                      placeholder='YouTube URL'
                      name='youtube'
                      value={youtube}
                      onChange={handleChange}
                    />
                  </div>
                </Fragment>
              )}
            </form>
          </div>
          <div className='dashboard_manageboard mx-1'>
            <input
              type='submit'
              className='btn btn-dark'
              value='Submit'
              form='edit_form'
            />
            <Link to='/dashboard' className='btn btn-light'>
              Go back
            </Link>
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
  profile: state.profile.profile,
  loading: state.profile.loading
})

const mapDispatchToProps = dispatch => ({
  editProfile: data => dispatch(editProfileGenerator(data)),
  loadProfile: () => dispatch(fetchProfileGenerator())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditProfile)
