import React, { useEffect, Fragment } from 'react'
import { connect } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import Moment from 'react-moment'
import { fetchPostByIdGenerator } from '../../store/actions/post'
import Spinner from '../layout/Spinner'
import CommentForm from './CommentForm'
import CommentItem from './CommentItem'
import Alert from '../layout/Alert'

const Post = ({ isAuthenticated, post, isLoading, loadPost, alerts }) => {
  const { post_id } = useParams()

  useEffect(() => {
    if (isAuthenticated) {
      const id = post_id
      loadPost(id)
    }
  }, [isAuthenticated])

  return (
    <section className='container'>
      {alerts.length > 0 && <Alert />}
      {!isLoading && post ? (
        <Fragment>
          <Link to='/posts' className='btn'>
            Back to posts
          </Link>
          <div className='post bg-white my-1 p-1'>
            <div>
              {/* if link directs to non-existent profile -> there will be a instant spinner -> fix it  */}
              <Link to={`/profiles/${post.owner}`}>
                <img className='round-img my-1' src={post.avatar} />
                <h4>{post.ownerName}</h4>
              </Link>
            </div>
            <div>
              <p className='my-1'>{post.text}</p>
              <p className='my-1'>
                Posted on <Moment date={post.createdAt} format='YYYY/MM/DD' />
              </p>
            </div>
          </div>
          <div className='post-form'>
            <div className='post-form-header bg-primary'>
              <h3>Leave a comment</h3>
            </div>
            <CommentForm postId={post_id} />
            <div className='posts'>
              {post.comments.length > 0 &&
                post.comments.map(comment => (
                  <CommentItem
                    key={comment._id}
                    postId={post_id}
                    comment={comment}
                  />
                ))}
            </div>
          </div>
        </Fragment>
      ) : (
        <Spinner />
      )}
    </section>
  )
}

const mapStateToProps = state => ({
  isAuthenticated: state.authentication.isAuthenticated,
  alerts: state.alerts,
  post: state.post.post,
  isLoading: state.post.loading
})

const mapDispatchToProps = dispatch => ({
  loadPost: postId => dispatch(fetchPostByIdGenerator(postId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Post)
