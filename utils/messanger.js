const moment = require('moment')

const messageOnComment = (
  commentator,
  postCreatedAt,
  postComments,
  postLikes
) => {
  // assuming post has at least one comment -->
  let commentsSummary
  if (postComments !== undefined && postComments.length > 0) {
    postComments.length > 1
      ? (commentsSummary = `${postComments.length} comments`)
      : (commentsSummary = 'one comment')
  }
  // post may have not any likes -->
  let likesSummary
  if (postLikes !== undefined && postLikes.length > 0) {
    postLikes.length > 1
      ? (likesSummary = `${postLikes.length} likes`)
      : (likesSummary = 'one like')
  }
  // build final message -->
  let message
  likesSummary
    ? (message = `Currently your post has ${commentsSummary} and ${likesSummary}.`)
    : (message = `Currently your post has ${commentsSummary}.`)

  return `<p>While you were away ${commentator} commented on the topic your raised ${moment(
    postCreatedAt
  ).format('MMMM Do YYYY')}.</p>
     <p>${message}</p>
     <p>Hope you will continue discussion when you'll have spare time.</p>
     <p style="font-style: italic;">Warm regards, jKorum</p>`
}

module.exports = {
  messageOnComment
}
