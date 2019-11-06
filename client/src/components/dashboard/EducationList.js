import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import Moment from 'react-moment'
import sorter from '../../utils/resentOnTop'

import { deleteEducationGenerator } from '../../store/actions/profile'

// problem to solve -> add sort experiences depend on `from` field
const EducationList = ({ education, deleteEducation }) => {
  const handleDelete = id => {
    deleteEducation(id)
  }

  return (
    education.length > 0 && (
      <Fragment>
        <h2>Education</h2>
        <table className='table'>
          <thead>
            <tr>
              <th>School</th>
              <th className='hide-sm'>Degree</th>
              <th className='hide-sm'>Years</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorter(education).map(item => (
              <tr key={item._id}>
                <td>{item.school}</td>
                <td className='hide-sm'>{item.degree}</td>
                <td className='hide-sm'>
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
                    title='delete education'
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
  deleteEducation: id => dispatch(deleteEducationGenerator(id))
})

export default connect(
  null,
  mapDispatchToProps
)(EducationList)
