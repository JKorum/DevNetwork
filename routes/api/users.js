const express = require('express')
const { validationResult } = require('express-validator')
const gravatar = require('gravatar')
const tokenGenerator = require('../../utils/token-generator')
const {
  registerValidation,
  loginValidation
} = require('../../utils/validation-middlewares')
const UserModel = require('../../models/User')

//temp
const bcrypt = require('bcryptjs')

const router = express.Router()

//@route   POST api/users/register
//@desc    register user
//@access  public
router.post('/register', registerValidation, async (req, res) => {
  //check req for validity
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() })
  }

  try {
    const { name, email, password } = req.body
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

//@route   POST api/users/login
//@desc    login user
//@access  public
router.post('/login', loginValidation, async (req, res) => {
  //check req for validity
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() })
  }

  try {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email })
    if (user) {
      const isValid = await bcrypt.compare(password, user.password)
      if (isValid) {
        //generate token and add new session
        const token = await tokenGenerator(user.id)
        await user.updateOne({ $addToSet: { tokens: { token } } }) // -> to not trigger `pre` hook with `save`
        res.status(200).send({ token })
      } else {
        throw new Error('password not valid')
      }
    } else {
      throw new Error('no user with such email')
    }
  } catch (err) {
    console.log(err.message)
    res.status(400).send({ errors: [{ msg: 'login failed' }] })
  }
})

//unregister route (in-> token out-> delete account)
//log out route (in-> token out-> delete token from array)
//update account route (in-> token out-> updated profile)

module.exports = router
