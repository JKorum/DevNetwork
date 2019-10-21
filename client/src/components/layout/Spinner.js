import React, { Fragment } from 'react'
import spinner from '../../imgs/loader.gif'

// to center spinner on screen -> set .container { height: 100vh }
export default () => (
  <Fragment>
    <img
      src={spinner}
      style={{
        width: '100px',
        display: 'block',
        margin: 'auto'
      }}
      alt='loading...'
    />
  </Fragment>
)
