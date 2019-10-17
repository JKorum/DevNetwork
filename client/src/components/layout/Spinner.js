import React, { Fragment } from 'react'
import spinner from '../../imgs/loader.gif'

export default () => (
  <Fragment>
    <img
      src={spinner}
      style={{ width: '100px', display: 'block', margin: 'auto' }}
      alt='loading...'
    />
  </Fragment>
)
