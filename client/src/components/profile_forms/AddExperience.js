import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  fetchProfileGenerator,
  addExperienceGenerator
} from '../../store/actions/profile'

const AddExperience = ({ loadProfile, addExperience, history }) => {
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
      <h1 className='large text-primary'>Add an experience</h1>
      <p className='lead'>
        <i className='fas fa-code-branch'></i>Add any developer/programming
        positions that you have had in the past
      </p>
      <small>* required fields</small>
      <form className='form' onSubmit={handleSubmit}>
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
          <h4>* From date</h4>
          <input
            type='date'
            name='from'
            value={from}
            onChange={handleChange}
            required
          />
        </div>
        <div className='form-group'>
          <h4>To date</h4>
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
              onChange={e => setFormData({ ...formData, current: !current })}
            />
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
        <input type='submit' className='btn btn-primary my-1' value='Submit' />
        <Link to='/dashboard' className='btn my-1'>
          Go back
        </Link>
      </form>
    </section>
  )
}

const mapDispatchToProps = dispatch => ({
  loadProfile: () => dispatch(fetchProfileGenerator()),
  addExperience: (data, history) =>
    dispatch(addExperienceGenerator(data, history))
})

export default connect(
  null,
  mapDispatchToProps
)(AddExperience)
