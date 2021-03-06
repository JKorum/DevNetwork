const express = require('express')
const { validationResult } = require('express-validator')
const gravatar = require('gravatar')

const sgMail = require('@sendgrid/mail')
const config = require('config')

const tokenGenerator = require('../../utils/token-generator')
const auth = require('../../utils/auth')
const {
  registerValidation,
  loginValidation,
  updateValidation,
  imageValidation,
  emailValidation,
  passwordValidation
} = require('../../utils/validation-middlewares')
const UserModel = require('../../models/User')

//temp
const bcrypt = require('bcryptjs')

const router = express.Router()

/* recovery password routes ---> */

// -> client: form to send email (handler to first route)

//@route   POST api/users/recovery
//@desc    send user email with token link
//@access  public
router.post('/recovery', emailValidation, async (req, res) => {
  // check email validity
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() })
  }
  try {
    // check if there is a user with that email
    const { email } = req.body
    const user = await UserModel.findOne({ email }).select('_id name email')
    if (!user) {
      // status 400 -> intentionally
      return res.status(400).send({ errors: [{ msg: 'recovery failed' }] })
    }
    // generate token & save it to user's array
    const token = await tokenGenerator(user._id)
    // following operation shouldn't trigger `pre` hook with `save`
    await UserModel.findByIdAndUpdate(user._id, {
      $addToSet: { tokens: { token } }
    })
    // send email with token link
    let link
    // when deployed use another link
    if (process.env.NODE_ENV === 'production') {
      link = `http://devnetwork.jkorum.com/recovery?token=${token}`
    } else {
      link = `http://127.0.0.1:3000/recovery?token=${token}`
    }

    if (config.has('sendGrid') && config.has('mail')) {
      sgMail.setApiKey(config.get('sendGrid'))
      const msg = {
        to: user.email,
        from: config.get('mail'),
        subject: 'Password recovery from DevNetwork',
        html: `<p>Hello, ${user.name}! It looks like you forgot password to your account.</p>
        <p>If it is true please follow the link below to recover your password, else do nothing.</p>
        <a href=${link} rel="noopener noreferrer">Recovery Link</a>
        <p style="font-style: italic;">Warm regards, jKorum</p>`
      }
      sgMail.send(msg)
    }

    res.status(200).send()
  } catch (err) {
    console.log(err.message)
    return res.status(500).send({ errors: [{ msg: 'server error' }] })
  }
})

// -> client: a) ok -> show form with fields for new password (handler to second route)
//            b) not ok -> show form to send email

router.patch(
  '/recovery/confirm',
  auth,
  passwordValidation,
  async (req, res) => {
    // check password validity
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).send({ errors: errors.array() })
    }
    try {
      const { userId, password } = req.body

      const user = await UserModel.findById(userId)
      if (!user) {
        // status 400 -> intentionally
        return res.status(400).send({ errors: [{ msg: 'recovery failed' }] })
      }
      // update user password & end all sessions
      user.password = password
      user.tokens = []
      // trigger `pre` save hook -> to hash password
      await user.save()
      res.status(200).send()
    } catch (err) {
      console.log(err.message)
      return res.status(500).send({ errors: [{ msg: 'server error' }] })
    }
  }
)

// -> client: a) ok -> redirect to landing
//            b) not ok -> show alert

/* <--- recovery password routes */

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

    // sending welcome email
    if (config.has('sendGrid') && config.has('mail')) {
      sgMail.setApiKey(config.get('sendGrid'))
      const msg = {
        to: email,
        from: config.get('mail'),
        subject: `Welcome to DevNetwork, ${name}!`,
        html: `<p>Thank you for your interest to DevNetwork project! I hope you will find it worthy of your attention.</p>
        <p style="font-style: italic;">Warm regards, jKorum</p>`
      }
      sgMail.send(msg)
    }

    res.status(201).send({ token })
  } catch (err) {
    console.log(err.message)
    return res.status(500).send({ errors: [{ msg: 'server error' }] })
  }
})

//@route   DELETE api/users/unregister
//@desc    delete user
//@access  private
router.delete('/unregister', auth, async (req, res) => {
  const { userId } = req.body
  try {
    const { name, email } = await UserModel.findByIdAndDelete(userId).select(
      'name email'
    )

    // sending farawell email
    if (config.has('sendGrid') && config.has('mail')) {
      sgMail.setApiKey(config.get('sendGrid'))
      const msg = {
        to: email,
        from: config.get('mail'),
        subject: `Farewell from DevNetwork`,
        html: `<p>It's sad you have to go, ${name}. But that's ok. Take care and stay awesome!</p>
        <p style="font-style: italic;">Warm regards, jKorum</p>`
      }
      sgMail.send(msg)
    }

    res.status(204).send()
  } catch (err) {
    console.log(err.message)
    res.status(500).send({ errors: [{ msg: 'server error' }] })
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
        // following operation shouldn't trigger `pre` hook with `save`
        // emailSentCounter -> 0 to set notification counter to default for email sending
        await user.updateOne({
          $addToSet: { tokens: { token } },
          $set: { emailSentCounter: 0 }
        })
        res.status(200).send({ token })
      } else {
        throw new Error('password not valid')
      }
    } else {
      throw new Error('no user with such email')
    }
  } catch (err) {
    console.log(err.message)
    res.status(400).send({ errors: [{ msg: 'login failed' }] }) //maybe add status 500
  }
})

//@route   PATCH api/users/logout
//@desc    logout from current session
//@access  private
router.patch('/logout', auth, async (req, res) => {
  const { userId, token } = req.body
  try {
    const user = await UserModel.findById(userId)
    await user.updateOne({ $pull: { tokens: { token } } })
    res.status(204).send()
  } catch (err) {
    console.log(err.message)
    res.status(500).send({ errors: [{ msg: 'server error' }] })
  }
})

//@route   PATCH api/users/logoutall
//@desc    logout from all sessions
//@access  private
router.patch('/logoutall', auth, async (req, res) => {
  const { userId } = req.body
  try {
    await UserModel.findByIdAndUpdate(userId, { tokens: [] })
    res.status(204).send()
  } catch (err) {
    console.log(err.message)
    res.status(500).send({ errors: [{ msg: 'server error' }] })
  }
})

//@route   PATCH api/users/update
//@desc    update user credentials
//@access  private
router.patch('/update', auth, updateValidation, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() })
  }
  const { userId, name, email, password } = req.body
  if (!name && !email && !password) {
    return res.status(400).send({ errors: [{ msg: 'no updates provided' }] })
  }
  try {
    if (name) {
      await UserModel.findByIdAndUpdate(
        userId,
        { name },
        { useFindAndModify: false }
      )
    }
    if (email) {
      await UserModel.findByIdAndUpdate(userId, { email })
    }
    if (password) {
      const user = await UserModel.findById(userId)
      user.password = password
      await user.save()
    }
    res.status(200).send({ status: 'user updated' }) //maybe should send some user data back
  } catch (err) {
    console.log(err.message)
    res.status(500).send({ errors: [{ msg: 'server error' }] })
  }
})

//@route   POST api/users/image
//@desc    set user profile img
//@access  private
router.patch('/image', auth, imageValidation, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() })
  }
  const { userId, image } = req.body

  try {
    await UserModel.findByIdAndUpdate(userId, {
      useImage: true,
      image
    })
    res.status(204).send()
  } catch (err) {
    console.log(err.message)
    res.status(500).send({ errors: [{ msg: 'server error' }] })
  }
})

//@route   POST api/users/image
//@desc    toggle USAGE of user profile img
//@access  private
router.patch('/image/toggle', auth, async (req, res) => {
  const { userId } = req.body
  try {
    const user = await UserModel.findById(userId).select('useImage')
    if (user.useImage !== undefined) {
      // user have already set an image -> toggle img usage
      await UserModel.findByIdAndUpdate(userId, { useImage: !user.useImage })
      res.status(204).send()
    } else {
      // user haven't set an image yet -> execution impossible
      res.status(400).send({ errors: [{ msg: 'profile image is not set up' }] })
    }
  } catch (err) {
    console.log(err.message)
    res.status(500).send({ errors: [{ msg: 'server error' }] })
  }
})

module.exports = router
