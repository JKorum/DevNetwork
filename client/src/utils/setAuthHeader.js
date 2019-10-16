import { defaults } from 'axios'

// in-> token from `localStorage`
export default token => {
  // check if token is in `localStorage`
  if (token) {
    // token exists -> set global header for all `axios` requests
    defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    // token doesn't exist -> delete global header
    delete defaults.headers.common['Authorization']
  }
}

/*
  server expect header 'Authorization': 'Bearer 21235445345'
  -> client should send it in that format
  `localStorage  holds token in format '21235445345'
*/
