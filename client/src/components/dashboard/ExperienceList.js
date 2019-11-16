import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import Moment from 'react-moment'
import { deleteExperienceGenerator } from '../../store/actions/profile'
import sorter from '../../utils/resentOnTop'

// problem to solve -> add sort experiences depend on `from` field
const ExperienceList = ({ experience, deleteExperience }) => {
  const handleDelete = id => {
    deleteExperience(id)
  }

  return (
    experience.length > 0 && (
      <Fragment>
        <h2>Experience</h2>
        <table className='table'>
          <thead>
            <tr>
              <th>Company</th>
              <th>Title</th>
              <th className='dash-hide'>Years</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorter(experience).map(item => (
              <tr key={item._id}>
                <td>{item.company}</td>
                <td>{item.title}</td>
                <td className='dash-hide'>
                  <Moment date={item.from} format='YYYY/MM/DD' /> -{' '}
                  {item.current ? (
                    'Till Now'
                  ) : (
                    <Moment date={item.to} format='YYYY/MM/DD' />
                  )}
                </td>
                <td>
                  <i
                    className='fas fa-backspace'
                    onClick={e => handleDelete(item._id)}
                    title='delete experience'
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Fragment>
    )
  )
}

const mapDispatchToProps = dispatch => ({
  deleteExperience: id => dispatch(deleteExperienceGenerator(id))
})

export default connect(null, mapDispatchToProps)(ExperienceList)
