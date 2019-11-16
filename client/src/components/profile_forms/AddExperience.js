import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  fetchProfileGenerator,
  addExperienceGenerator
} from '../../store/actions/profile'
import Alert from '../layout/Alert'

const AddExperience = ({ loadProfile, addExperience, history, alerts }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    from: '',
    to: '',
    current: false,
    description: ''
  })

  const { title, company, location, from, to, current, description } = formData

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = e => {
    e.preventDefault()
    // filter data -> server validation don't allow empty strings in optional fields
    // maybe -> need implement complex solution
    const filtered = {}
    Object.entries(formData).forEach(item => {
      if (formData[item[0]] !== '') {
        filtered[item[0]] = item[1]
      }
    })
    addExperience(filtered, history)
  }

  useEffect(() => {
    loadProfile()
  }, [])

  return (
    <section className='container'>
      {alerts.length > 0 && <Alert />}
      <h1 className='section-head text-primary mx-1'>Experience</h1>

      <div className='dashboard-header bg-primary mx-1'>
        <h4 className='dashboard-greeting'>Add your programming experience</h4>
      </div>
      <div className='dashboard_main my-1 p-1'>
        <small>* required fields</small>
        <form id='exp_form' className='form' onSubmit={handleSubmit}>
          <div className='form-group'>
            <input
              type='text'
              placeholder='* Job title'
              name='title'
              value={title}
              onChange={handleChange}
              required
            />
          </div>
          <div className='form-group'>
            <input
              type='text'
              placeholder='* Company'
              name='company'
              value={company}
              onChange={handleChange}
              required
            />
          </div>
          <div className='form-group'>
            <input
              type='text'
              placeholder='Location'
              name='location'
              value={location}
              onChange={handleChange}
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
              Current job
            </p>
          </div>
          <div className='form-group'>
            <textarea
              name='description'
              cols='30'
              rows='5'
              placeholder='Job description'
              value={description}
              onChange={handleChange}
            ></textarea>
          </div>
        </form>
      </div>
      <div className='dashboard_manageboard mx-1'>
        <input
          type='submit'
          className='btn btn-dark my-1'
          value='Submit'
          form='exp_form'
        />
        <Link to='/dashboard' className='btn my-1'>
          Go back
        </Link>
      </div>
    </section>
  )
}

const mapStateToProps = state => ({
  alerts: state.alerts
})

const mapDispatchToProps = dispatch => ({
  loadProfile: () => dispatch(fetchProfileGenerator()),
  addExperience: (data, history) =>
    dispatch(addExperienceGenerator(data, history))
})

export default connect(mapStateToProps, mapDispatchToProps)(AddExperience)
