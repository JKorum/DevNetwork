import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  fetchProfileGenerator,
  addEducationGenerator
} from '../../store/actions/profile'
import Alert from '../layout/Alert'

const AddEducation = ({
  alerts,
  isProfileLoaded,
  loadProfile,
  addEducation,
  history
}) => {
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    fieldofstudy: '',
    from: '',
    to: '',
    current: false,
    description: ''
  })

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = formData

  // in case of hard refresh -> fetch profile
  useEffect(() => {
    if (!isProfileLoaded) {
      console.log('useEffect from AddEducation')
      loadProfile()
    }
  }, [])

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = e => {
    e.preventDefault()
    const filtered = {}
    Object.entries(formData).forEach(item => {
      if (formData[item[0]] !== '') {
        filtered[item[0]] = item[1]
      }
    })

    addEducation(filtered, history)
  }

  return (
    <section className='container'>
      {alerts.length > 0 && <Alert />}
      <h1 className='large text-primary mx-1'>Education</h1>
      <div className='dashboard-header bg-primary mx-1'>
        <h4>Add school, bootcamp, online course etc.</h4>
      </div>

      <div className='dashboard_main my-1 p-1'>
        <small>* required fields</small>
        <form id='edu_form' className='form' onSubmit={handleSubmit}>
          <div className='form-group'>
            <input
              type='text'
              placeholder='* School/bootcamp/course'
              name='school'
              value={school}
              onChange={handleChange}
              required
            />
          </div>
          <div className='form-group'>
            <input
              type='text'
              placeholder='* Degree/certificate'
              name='degree'
              value={degree}
              onChange={handleChange}
              required
            />
          </div>
          <div className='form-group'>
            <input
              type='text'
              placeholder='* Field of study'
              name='fieldofstudy'
              value={fieldofstudy}
              onChange={handleChange}
              required
            />
          </div>
          <div className='form-group'>
            <p>* From date</p>
            <input
              type='date'
              name='from'
              value={from}
              onChange={handleChange}
              required
            />
          </div>
          <div className='form-group'>
            <p>To date</p>
            <input
              type='date'
              name='to'
              value={to}
              onChange={handleChange}
              disabled={current}
            />
          </div>
          <div className='form-group'>
            <p>
              <input
                type='checkbox'
                name='current'
                value={current}
                onChange={e =>
                  setFormData({ ...formData, current: !current, to: '' })
                }
              />{' '}
              Current school
            </p>
          </div>
          <div className='form-group'>
            <textarea
              name='description'
              cols='30'
              rows='5'
              placeholder='Program description'
              value={description}
              onChange={handleChange}
            ></textarea>
          </div>
        </form>
      </div>
      <div className='dashboard_manageboard mx-1'>
        <input
          type='submit'
          className='btn btn-dark'
          value='Submit'
          form='edu_form'
        />
        <Link to='/dashboard' className='btn'>
          Go back
        </Link>
      </div>
    </section>
  )
}

const mapStateToProps = state => ({
  alerts: state.alerts,
  isProfileLoaded: state.profile.profile
})

const mapDispatchToProps = dispatch => ({
  loadProfile: () => dispatch(fetchProfileGenerator()),
  addEducation: (data, history) =>
    dispatch(addEducationGenerator(data, history))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddEducation)
