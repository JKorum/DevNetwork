import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import Moment from 'react-moment'
import { fetchPostByIdGenerator } from '../../store/actions/post'
import Spinner from '../layout/Spinner'
import CommentForm from './CommentForm'
import CommentItem from './CommentItem'

const Post = ({ isAuthenticated, post, isLoading, loadPost }) => {
  const { post_id } = useParams()

  useEffect(() => {
    if (isAuthenticated) {
      const id = post_id
      loadPost(id)
    }
  }, [isAuthenticated])

  return !isLoading && post ? (
    <div className='post bg-white my-1 p-1'>
      <Link to='/posts' className='btn'>
        Back to posts
      </Link>
      <div>
        {/* if link directs to non-existent profile -> there will be a instant spinner -> fix it  */}
        <Link to={`/profiles/${post.owner}`}>
          <img className='round-img my-1' src={post.avatar} />
          <h4>{post.ownerName}</h4>
        </Link>
      </div>
      <div>
        <p className='my-1'>{post.text}</p>
        <p className='post-date'>
          Posted on <Moment date={post.createdAt} format='YYYY/MM/DD' />
        </p>
      </div>
      <CommentForm postId={post_id} />
      {/* should be className='comments'? */}
      <div className='posts'>
        {post.comments.length > 0 &&
          post.comments.map(comment => (
            <CommentItem key={comment._id} postId={post_id} comment={comment} />
          ))}
      </div>
    </div>
  ) : (
    <Spinner />
  )
}

const mapStateToProps = state => ({
  isAuthenticated: state.authentication.isAuthenticated,
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
