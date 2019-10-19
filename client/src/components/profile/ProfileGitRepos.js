import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import profile from '../../store/reducers/profile'
import { getReposGenerator } from '../../store/actions/profile'

const ProfileGitRepos = ({ githubusername, repos, loadRepos }) => {
  useEffect(() => {
    loadRepos(githubusername)
  }, [])

  return (
    repos.length > 0 && (
      <div className='profile-github'>
        <h2 className='text-primary my-1'>
          <i className='fab fa-github'></i>Github repos
        </h2>
        {repos.map(repo => (
          <div key={repo.id} className='repo bg-white my-1 p-1'>
            <div>
              <h4>
                <a
                  href={repo.html_url}
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  {repo.name}
                </a>
              </h4>
              <p>{repo.description ? repo.description : 'No description'}</p>
            </div>
            <div>
              <ul>
                <li className='badge badge-primary'>
                  Stars: {repo.stargazers_count}
                </li>
                <li className='badge badge-dark'>
                  Watchers: {repo.watchers_count}
                </li>
                <li className='badge badge-light'>Forks: {repo.forks_count}</li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    )
  )
}

const mapStateToProps = state => ({
  repos: state.profile.repos
})

const mapDispatchToProps = dispatch => ({
  loadRepos: name => dispatch(getReposGenerator(name))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileGitRepos)
