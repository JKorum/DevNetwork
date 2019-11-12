import uuidv4 from 'uuid/v4'
import { SET_ALERT, REMOVE_ALERT } from './types'

// action generator -> function (receives `dispatch`, `getState` from store)
// with `redux-thunk` it's possible to return `sync` or `async` function
export const setAlert = (msg, alertType) => {
  const id = uuidv4()

  return dispatch => {
    dispatch({
      type: SET_ALERT,
      payload: { msg, alertType, id }
    })

    setTimeout(() => {
      dispatch({
        type: REMOVE_ALERT,
        payload: { id }
      })
    }, 2000)
  }
}
