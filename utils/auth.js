const jwt = require('jsonwebtoken')
const UserModel = require('../models/User')
const config = require('config')

//in-> token out-> token validity, session status (`active` in token in array)
module.exports = async (req, res, next) => {
  try {
    let token = req.get('Authorization')
    if (token) {
      token = token.slice(7)
      if (config.has('tokenSign')) {
        //extract payload from token
        const payload = await jwt.verify(token, config.get('tokenSign'))
        const {
          user: { id }
        } = payload
        //check user with arrived id and token
        const user = await UserModel.findOne({ _id: id, 'tokens.token': token })
        if (user) {
          //attach user id to req
          req.body.userId = user._id
          next()
        } else {
          res.status(401).send({ errors: [{ msg: 'authorization failed' }] })
        }
      } else {
        throw new Error('token signature not accessible')
      }
    } else {
      res.status(401).send({ errors: [{ msg: 'authorization failed' }] })
    }
  } catch (err) {
    console.log(err.message)
    res.status(500).send({ errors: [{ msg: 'server error' }] })
  }
}
