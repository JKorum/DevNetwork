// in-> number of comments
// out-> comments > 0 --> comments dark ELSE --> comments grey
export default comments => {
  if (comments > 0) {
    return ' widget_dark'
  } else {
    return ' widget_grey'
  }
}
