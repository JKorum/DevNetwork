import moment from 'moment'

export default list => {
  const sorted = [...list]
  sorted.sort((a, b) => {
    if (moment(a.from).isAfter(moment(b.from))) {
      return -1
    } else if (moment(a.from).isBefore(moment(b.from))) {
      return 1
    } else {
      return 0
    }
  })
  return sorted
}
