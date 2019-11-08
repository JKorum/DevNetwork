import React, { Fragment } from 'react'
import spinner from '../../imgs/loader2.gif'

// to center spinner on screen -> set .container { height: 100vh }
export default () => (
  <Fragment>
    <img
      src={spinner}
      className='spinner'
      style={{
        width: '150px',
        display: 'block',
        margin: 'auto'
      }}
      alt='loading...'
    />
  </Fragment>
)
