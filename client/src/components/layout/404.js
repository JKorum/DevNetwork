import React from 'react'
import video from '../../media/background.mp4'

const NotFound = () => (
  <section className='landing'>
    <div className='dark-overlay'>
      <video src={video} autoPlay loop muted></video>

      <div className='landing-inner'>
        <h1 className='x-large'>404</h1>
        <h2 className='lead'>Sorry, the requested page doesn't exist</h2>
      </div>
    </div>
  </section>
)

export default NotFound
