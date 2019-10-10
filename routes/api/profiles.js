const express = require('express')
const auth = require('../../utils/auth')
const { validationResult } = require('express-validator')
const ProfileModel = require('../../models/Profile')
const UserModel = require('../../models/User')
const {
  profileValidation,
  profileUpdateValidation
} = require('../../utils/validation-middlewares')
const profileBuilder = require('../../utils/profile-builder')

const router = express.Router()

//@route   POST api/profiles
//@desc    create user profile
//@access  private
router.post('/', auth, profileValidation, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() })
  }
  try {
    const { userId } = req.body
    //maybe in middleware->
    const user = await ProfileModel.findOne({ user: userId })
    if (user) {
      return res.status(400).send({ errors: 'profile already exists' })
    }
    const profile = profileBuilder(req.body)
    const userProfile = new ProfileModel(profile)
    await userProfile.save()
    res.status(201).send(userProfile)
  } catch (err) {
    console.log(err.message)
    res.status(500).send({ errors: [{ msg: 'server error' }] })
  }
})

//@route   GET api/profiles/me
//@desc    get user profile
//@access  private
router.get('/me', auth, async (req, res) => {
  const { userId } = req.body

  try {
    let profile = await ProfileModel.findOne({ user: userId })
    if (profile) {
      await profile
        .populate({
          path: 'user',
          select: ['name', 'avatar']
        })
        .execPopulate()
      res.status(200).send(profile)
    } else {
      res.status(404).send({ errors: [{ msg: 'profile not found' }] })
    }
  } catch (err) {
    console.log(err.message)
    res.status(500).send({ errors: [{ msg: 'server error' }] })
  }
})

//@route   PATCH api/profiles/me/update
//@desc    update user profile
//@access  private
router.patch('/me/update', auth, profileUpdateValidation, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() })
  }
  const { userId } = req.body
  try {
    let profile = await ProfileModel.findOne({ user: userId })
    if (!profile) {
      return res.status(404).send({ errors: "profile doesn't exists" })
    }
    const updates = profileBuilder(req.body)

    profile = await ProfileModel.findOneAndUpdate(
      { user: userId },
      { $set: updates },
      { new: true }
    )
    res.status(200).send(profile)
  } catch (err) {
    console.log(err)
    res.status(500).send({ errors: [{ msg: 'server error' }] })
  }
})

//@route   GET api/profiles
//@desc    get all profiles
//@access  public
router.get('/', async (req, res) => {
  try {
    const profiles = await ProfileModel.find()
      .populate({ path: 'user', select: ['name', 'avatar'] })
      .exec()
    if (profiles.length === 0) {
      res.status(404).send({ errors: [{ msg: 'no profiles' }] })
    } else {
      res.status(200).send(profiles)
    }
  } catch (err) {
    console.log(err)
    res.status(500).send({ errors: [{ msg: 'server error' }] })
  }
})

//@route   GET api/profiles/user/:user_id
//@desc    get profile by user id
//@access  public
router.get('/user/:user_id', async (req, res) => {
  try {
    let profile = await ProfileModel.findOne({ user: req.params.user_id })
    if (profile) {
      profile = await profile
        .populate({ path: 'user', select: ['name', 'avatar'] })
        .execPopulate()
      res.status(200).send(profile)
    } else {
      res.status(404).send({ errors: [{ msg: 'profile not found' }] })
    }
  } catch (err) {
    console.log(err)
    if (err.kind === 'ObjectId') {
      res.status(404).send({ errors: [{ msg: 'profile not found' }] })
    } else {
      res.status(500).send({ errors: [{ msg: 'server error' }] })
    }
  }
})

//@route   DELETE api/profiles
//@desc    delete profile
//@access  private
router.delete('/', auth, async (req, res) => {
  const { userId } = req.body
  try {
    console.log(userId)
    const profile = await ProfileModel.findOneAndDelete({ user: userId })
    if (profile) {
      res.status(204).send()
    } else {
      res.status(404).send({ errors: [{ msg: 'profile not found' }] })
    }
  } catch (err) {
    console.log(err)
    res.status(500).send({ errors: [{ msg: 'server error' }] })
  }
})

module.exports = router
