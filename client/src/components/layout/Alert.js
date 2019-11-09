import React from 'react'
import { connect } from 'react-redux'

const Alert = ({ alerts }) => {
  return (
    alerts !== null &&
    alerts.length > 0 &&
    alerts.map(alert => {
      const { id, alertType, msg } = alert
      return (
        <div
          key={id}
          className={`alert alert-${alertType} animated bounceInUp`}
        >
          {alertType === 'danger' ? (
            <i className='fas fa-times-circle'></i>
          ) : alertType === 'success' ? (
            <i className='fas fa-check-circle'></i>
          ) : (
            <i className='fas fa-chevron-circle-right'></i>
          )}
          <p>{msg}</p>
        </div>
      )
    })
  )
}

const mapStateToProps = state => ({
  alerts: state.alerts
})

export default connect(mapStateToProps)(Alert)
