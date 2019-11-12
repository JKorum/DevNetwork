import React, { Fragment, useState, useEffect } from 'react'
import spinner from '../../imgs/loader2.gif'
import { Redirect } from 'react-router-dom'

export default () => {
  const [countToRedirect, setCountToRedirect] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCountToRedirect(countToRedirect + 1)
    }, 1000)

    return () => clearInterval(id)
  }, [countToRedirect])

  return (
    <Fragment>
      {countToRedirect < 2 ? (
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
      ) : (
        <Redirect to='/dashboard' />
      )}
    </Fragment>
  )
}
