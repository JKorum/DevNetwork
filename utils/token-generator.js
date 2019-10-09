const config = require('config')
const jwt = require('jsonwebtoken')

//in-> id out-> token
module.exports = async id => {
  try {
    if (config.has('tokenSign')) {
      const payload = {
        user: { id }
      }
      const token = await jwt.sign(payload, config.get('tokenSign'), {
        expiresIn: '3 days'
      })
      return token
    } else {
      throw new Error('token signature not accessible')
    }
  } catch (err) {
    throw err
  }
}
