const express = require('express')
const { validationResult } = require('express-validator')
const gravatar = require('gravatar')
const tokenGenerator = require('../../utils/token-generator')
const validation = require('../../utils/validation-middlewares')
const UserModel = require('../../models/User')

const router = express.Router()

//@route   POST api/users
//@desc    register user
//@access  public
router.post('/', validation, async (req, res) => {
  //check req for validity
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() })
  }

  const { name, email, password } = req.body

  try {
    //check if user with sent email exists
    let user = await UserModel.findOne({ email })
    if (user) {
      return res.status(400).send({ errors: [{ msg: 'email is taken' }] })
    }
    //get url to gravatar or default pic
    const avatar = gravatar.url(email, {
      protocol: true,
      s: '200',
      r: 'g',
      d: 'retro'
    })
    //save new user
    user = new UserModel({ name, email, password, avatar })
    const token = await tokenGenerator(user.id)
    user.tokens.push({ token })
    await user.save()
    //maybe add additional info to res
    res.status(201).send({ token })
  } catch (err) {
    console.log(err.message)
    return res.status(500).send({ errors: [{ msg: 'server error' }] })
  }
})

module.exports = router
