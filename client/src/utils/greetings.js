import moment from 'moment'

const greetings = () => {
  const current = moment()

  // Have a good night -> 12:01 p.m. to 5:00 a.m.
  const midnightAndOne = moment()
    .set({ hour: 0, minute: 0, second: 0 })
    .add(1, 'seconds')

  const five = moment()
    .set({ hour: 0, minute: 0, second: 0 })
    .add(5, 'hours')

  // Good morning -> 5:01 a.m. to 12:00 p.m.
  const fiveAndOne = moment()
    .set({ hour: 0, minute: 0, second: 0 })
    .add(5, 'hours')
    .add(1, 'seconds')

  const twelve = moment()
    .set()
    .set({ hour: 0, minute: 0, second: 0 })
    .add(12, 'hours')

  // Good afternoon -> 12:01 p.m. to 6:00 p.m.
  const twelveAndOne = moment()
    .set({ hour: 0, minute: 0, second: 0 })
    .add(12, 'hours')
    .add(1, 'seconds')

  const sixteen = moment()
    .set({ hour: 0, minute: 0, second: 0 })
    .add(18, 'hours')

  // Good evening -> 6:01 p.m. to 12:00 p.m.
  const sixteenAndOne = moment()
    .set({ hour: 0, minute: 0, second: 0 })
    .add(18, 'hours')
    .add(1, 'seconds')

  const midnight = moment()
    .set({ hour: 0, minute: 0, second: 0 })
    .add(24, 'hours')

  if (current.isSameOrAfter(midnightAndOne) && current.isSameOrBefore(five)) {
    return 'Have a good night'
  } else if (
    current.isSameOrAfter(fiveAndOne) &&
    current.isSameOrBefore(twelve)
  ) {
    return 'Good morning'
  } else if (
    current.isSameOrAfter(twelveAndOne) &&
    current.isSameOrBefore(sixteen)
  ) {
    return 'Good afternoon'
  } else if (
    current.isSameOrAfter(sixteenAndOne) &&
    current.isSameOrBefore(midnight)
  ) {
    return 'Good evening'
  }
}

export default greetings
