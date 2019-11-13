import { RECOVERY_OK, RECOVERY_DEFAULT } from '../actions/types'

const initialState = false
export default function(state = initialState, action) {
  switch (action.type) {
    case RECOVERY_OK:
      return true
    case RECOVERY_DEFAULT:
      return false
    default:
      return state
  }
}
