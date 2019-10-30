// in-> array of likes & user id
// out-> user haven't liked --> heart grey / user have liked --> heart red
export default (likes, userId) => {
  const index = likes.findIndex(like => like.owner === userId)
  if (index === -1) {
    return ' heart_grey'
  } else {
    return ' heart_red'
  }
}
