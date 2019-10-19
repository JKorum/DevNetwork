import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { fetchProfileByIdGenerator } from '../../store/actions/profile'
import Spinner from '../layout/Spinner'

const Profile = ({
  loadProfile,
  profile: { profile, loading },
  authentication: auth
}) => {
  const { user_id } = useParams()

  useEffect(() => {
    loadProfile(user_id)
  }, [])

  return !loading || profile !== null ? (
    <section className='container'>
      <Link to='/profiles' className='btn'>
        Back to profiles
      </Link>
      {/* i don't like syntax -> */}
      {!auth.loading &&
        auth.isAuthenticated &&
        auth.user &&
        profile &&
        profile.user &&
        auth.user._id === profile.user._id && (
          <Link to='/edit-profile' className='btn btn-dark'>
            Edit profile
          </Link>
        )}
    </section>
  ) : (
    <Spinner />
  )
}

const mapStateToProps = state => ({
  authentication: state.authentication,
  profile: state.profile
})

const mapDispatchToProps = dispatch => ({
  loadProfile: id => dispatch(fetchProfileByIdGenerator(id))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile)

/*
<section class="container">
      <a href="profiles.html" class="btn">Back to profiles</a>
      <div class="profile-grid my-1">
        <!-- top -->
        <div class="profile-top bg-primary p-2">
          <img
            class="round-img my-1"
            src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200"
            alt="an image of a developer"
          />
          <h1 class="large">John Doe</h1>
          <p class="lead">Developer at Microsoft</p>
          <p>Seattle, WA</p>
          <div class="icons my-1">
            <a href="#"><i class="fas fa-globe fa-2x"></i></a>
            <a href="#"><i class="fab fa-twitter-square fa-2x"></i></a>
            <a href="#"><i class="fab fa-facebook fa-2x"></i></a>
            <a href="#"><i class="fab fa-linkedin fa-2x"></i></a>
            <a href="#"><i class="fab fa-instagram fa-2x"></i></a>
            <a href="#"><i class="fab fa-youtube fa-2x"></i></a>
          </div>
        </div>
        <!-- about -->
        <div class="profile-about bg-light p-2">
          <h2 class="text-primary">John's Bio</h2>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Non,
            beatae debitis culpa incidunt minima itaque. Repellat eveniet natus
            eius excepturi?
          </p>
          <div class="line"></div>
          <h2 class="text-primary">Skill Set</h2>
          <div class="skills">
            <div class="p-1"><i class="fas fa-check"></i>JavaScript</div>
            <div class="p-1"><i class="fas fa-check"></i>Python</div>
            <div class="p-1"><i class="fas fa-check"></i>HTML</div>
            <div class="p-1"><i class="fas fa-check"></i>CSS</div>
          </div>
        </div>
        <!-- experience -->
        <div class="profile-exp bg-white p-2">
          <h2 class="text-primary">Experiences</h2>
          <div>
            <h3>Microsoft</h3>
            <p>Oct 2011 - Current</p>
            <p><strong>Position: </strong>Senior Developer</p>
            <p>
              <strong>Description: </strong>Lorem, ipsum dolor sit amet
              consectetur adipisicing elit. Explicabo dicta modi beatae quod
              libero nemo qui cumque voluptates. Porro, aperiam.
            </p>
          </div>
          <div>
            <h3>Another company</h3>
            <p>Oct 2000 - 2011</p>
            <p><strong>Position: </strong>Senior Developer</p>
            <p>
              <strong>Description: </strong>Lorem, ipsum dolor sit amet
              consectetur adipisicing elit. Explicabo dicta modi beatae quod
              libero nemo qui cumque voluptates. Porro, aperiam.
            </p>
          </div>
        </div>
        <!-- education -->
        <div class="profile-edu bg-white p-2">
          <h2 class="text-primary">Education</h2>
          <div>
            <h3>University of Washington</h3>
            <p>Oct 1993 - 1999</p>
            <p><strong>Degree: </strong>Some degree</p>
            <p><strong>Field of study: </strong>Computer science</p>
            <p>
              <strong>Description: </strong>Lorem, ipsum dolor sit amet
              consectetur adipisicing elit. Explicabo dicta modi beatae quod
              libero nemo qui cumque voluptates. Porro, aperiam.
            </p>
          </div>
        </div>
        <!-- github repos -->
        <div class="profile-github">
          <h2 class="text-primary my-1">
            <i class="fab fa-github"></i>Github repos
          </h2>
          <div class="repo bg-white my-1 p-1">
            <div>
              <h4><a href="#">Repo One</a></h4>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Laudantium, quia!
              </p>
            </div>
            <div>
              <ul>
                <li class="badge badge-primary">Stars: 44</li>
                <li class="badge badge-dark">Watchers: 20</li>
                <li class="badge badge-light">Forks: 25</li>
              </ul>
            </div>
          </div>
          <div class="repo bg-white my-1 p-1">
            <div>
              <h4><a href="#">Repo Two</a></h4>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Laudantium, quia!
              </p>
            </div>
            <div>
              <ul>
                <li class="badge badge-primary">Stars: 44</li>
                <li class="badge badge-dark">Watchers: 20</li>
                <li class="badge badge-light">Forks: 25</li>
              </ul>
            </div>
          </div>
          <div class="repo bg-white my-1 p-1">
            <div>
              <h4><a href="#">Repo Three</a></h4>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Laudantium, quia!
              </p>
            </div>
            <div>
              <ul>
                <li class="badge badge-primary">Stars: 44</li>
                <li class="badge badge-dark">Watchers: 20</li>
                <li class="badge badge-light">Forks: 25</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>



*/
