const express = require('express')
const auth = require('../../utils/auth')
const UserModel = require('../../models/User')

const router = express.Router()

//@route   GET api/auth
//@desc    send back user data
//@access  private
router.get('/', auth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.userId).select(
      '_id name email avatar useImage image'
    )
    res.status(200).send(user)
  } catch (err) {
    console.log(err.message)
    return res.status(500).send({ errors: [{ msg: 'server error' }] })
  }
})

module.exports = router
