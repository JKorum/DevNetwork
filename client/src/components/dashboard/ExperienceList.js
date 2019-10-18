import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import Moment from 'react-moment'
import { deleteExperienceGenerator } from '../../store/actions/profile'

// problem to solve -> add sort experiences depend on `from` field
const ExperienceList = ({ experience, deleteExperience }) => {
  const handleDelete = id => {
    deleteExperience(id)
  }

  return (
    experience.length > 0 && (
      <Fragment>
        <h2 className='my-2'>Experience credentials</h2>
        <table className='table'>
          <thead>
            <tr>
              <th>Company</th>
              <th className='hide-sm'>Title</th>
              <th className='hide-sm'>Years</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {experience.map(item => (
              <tr key={item._id}>
                <td>{item.company}</td>
                <td className='hide-sm'>{item.title}</td>
                <td className='hide-sm'>
                  <Moment date={item.from} format='YYYY/MM/DD' /> -{' '}
                  {item.current ? (
                    'till now'
                  ) : (
                    <Moment date={item.to} format='YYYY/MM/DD' />
                  )}
                </td>
                <td>
                  <button
                    className='btn btn-danger'
                    onClick={e => handleDelete(item._id)}
                  >
                    Delete
                  </button>
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

export default connect(
  null,
  mapDispatchToProps
)(ExperienceList)
