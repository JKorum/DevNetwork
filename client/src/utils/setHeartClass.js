// in-> array of likes & user id
// out-> user haven't liked --> heart grey / user have liked --> heart red
export default (likes, userId) => {
  if (likes !== undefined) {
    const index = likes.findIndex(like => like.owner === userId)
    if (index === -1) {
      return ' widget_grey'
    } else {
      return ' widget_red'
    }
  }
}
