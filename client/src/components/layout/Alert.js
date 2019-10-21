import React from 'react'
import { connect } from 'react-redux'

// maybe all rendering logic is rudundant
const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map(alert => {
    const { id, alertType, msg } = alert
    return (
      <div key={id} className={`alert alert-${alertType}`}>
        {msg}
      </div>
    )
  })

const mapStateToProps = state => ({
  alerts: state.alerts
})

export default connect(mapStateToProps)(Alert)
