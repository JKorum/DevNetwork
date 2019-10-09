const express = require('express')
const auth = require('../../utils/auth')

const router = express.Router()

//@route   GET api/auth
//@desc    ...
//@access  private
router.get('/', auth, (req, res) => {
  //this route should send back user data (-tokens, -password) -> but why?
  console.log(req.body.userId)
  res.send({ status: 'pass middleware' })
})

module.exports = router
