const express = require('express')
const auth = require('../../utils/auth')
const request = require('request-promise')
const config = require('config')
const { validationResult } = require('express-validator')
const ProfileModel = require('../../models/Profile')
const UserModel = require('../../models/User')
const {
  profileValidation,
  profileUpdateValidation,
  experienceValidation,
  educationValidation
} = require('../../utils/validation-middlewares')
const profileBuilder = require('../../utils/profile-builder')

const router = express.Router()

/* general issues:
   > common functionality in routes -> extact it in util functions
   > /education -- /experience --> should work properly
   profile schema --> education and experience --> all fields should be optional
   express-validator --> should check for required fields if necessary
   --> so when you create education or experience --> some fields are required
   --> when you update education or experience --> all fields are optional --> and only they are updated
*/

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

//@route   PATCH api/profiles/experience
//@desc    add experience
//@access  private
router.patch('/experience', auth, experienceValidation, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() })
  }
  try {
    const {
      userId,
      title,
      company,
      from,
      location,
      to,
      current,
      description
    } = req.body
    const profile = await ProfileModel.findOne({ user: userId })
    if (!profile) {
      res.status(404).send({ errors: [{ msg: 'profile not found' }] })
    }
    profile.experience.push({
      title,
      company,
      from,
      location,
      to,
      current,
      description
    })
    await profile.save()
    res.status(200).send(profile.experience)
  } catch (err) {
    console.log(err)
    res.status(500).send({ errors: [{ msg: 'server error' }] })
  }
})

//@route   PATCH api/profiles/experience/:exp_id
//@desc    update experience by id
//@access  private
router.patch(
  '/experience/:exp_id',
  auth,
  experienceValidation,
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).send({ errors: errors.array() })
    }
    try {
      const {
        userId,
        title,
        company,
        location,
        from,
        to,
        description,
        current
      } = req.body

      const updates = {
        title,
        company,
        location,
        from,
        to,
        description,
        current
      }

      //find correct profile
      const profile = await ProfileModel.findOne({ user: userId })
      //find index of correct expence
      const index = profile.experience.findIndex(
        item => item._id.toString() === req.params.exp_id
      )
      //set fields only with truthy values
      for (item in updates) {
        if (updates[item]) {
          profile.experience[index][item] = updates[item]
        }
      }
      await profile.save()
      res.send(profile.experience[index])
    } catch (err) {
      console.log(err)
      res.status(500).send({ errors: [{ msg: 'server error' }] })
    }
  }
)

//@route   DELETE api/profiles/experience/:exp_id
//@desc    delete experience by id
//@access  private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await ProfileModel.findOne({ user: req.body.userId })
    profile.experience.pull({ _id: req.params.exp_id })
    await profile.save()
    res.status(204).send()
  } catch (err) {
    console.log(err)
    res.status(500).send({ errors: [{ msg: 'server error' }] }) //add logic for 404
  }
})

//@route   PATCH api/profiles/education
//@desc    add education
//@access  private
router.patch('/education', auth, educationValidation, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() })
  }
  try {
    const {
      userId,
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body
    const profile = await ProfileModel.findOne({ user: userId })
    if (!profile) {
      res.status(404).send({ errors: [{ msg: 'profile not found' }] })
    }
    profile.education.push({
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    })
    await profile.save()
    res.status(200).send(profile.education)
  } catch (err) {
    console.log(err)
    res.status(500).send({ errors: [{ msg: 'server error' }] })
  }
})

//@route   PATCH api/profiles/education/:edu_id
//@desc    update education by id
//@access  private
router.patch(
  '/education/:edu_id',
  auth,
  educationValidation,
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).send({ errors: errors.array() })
    }
    try {
      const {
        userId,
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      } = req.body

      const updates = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      }

      //find correct profile
      const profile = await ProfileModel.findOne({ user: userId })
      //find index of correct education
      const index = profile.education.findIndex(
        item => item._id.toString() === req.params.edu_id
      )
      //set fields only with truthy values
      for (item in updates) {
        if (updates[item]) {
          profile.education[index][item] = updates[item]
        }
      }
      await profile.save()
      res.send(profile.education[index])
    } catch (err) {
      console.log(err)
      res.status(500).send({ errors: [{ msg: 'server error' }] })
    }
  }
)

//@route   DELETE api/profiles/education/:edu_id
//@desc    delete education by id
//@access  private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await ProfileModel.findOne({ user: req.body.userId })
    profile.education.pull({ _id: req.params.edu_id })
    await profile.save()
    res.status(204).send()
  } catch (err) {
    console.log(err)
    res.status(500).send({ errors: [{ msg: 'server error' }] }) //should add logic for 404
  }
})

//@route   GET api/profiles/github/:username
//@desc    get user repos from github
//@access  public
router.get('/github/:username', async (req, res) => {
  try {
    if (config.has('gitId') && config.has('gitSecret')) {
      let response = await request({
        uri: `https://api.github.com/users/${
          req.params.username
        }/repos?per_page=5&sort=created:asc&client_id=${config.get(
          'gitId'
        )}&client_secret=${config.get('gitSecret')}`,
        method: 'GET',
        headers: { 'User-Agent': 'node.js' }
      })

      response = JSON.parse(response)
      if (response.length === 0) {
        return res
          .status(404)
          .send({ errors: [{ msg: 'github repos not found' }] })
      }
      res.status(200).send(response)
    } else {
      throw new Error('config values inaccessible')
    }
  } catch (err) {
    if (err.statusCode === 404) {
      res.status(404).send({ errors: [{ msg: 'git user not found' }] })
    } else {
      res.status(500).send({ errors: [{ msg: 'server error' }] })
    }
  }
})

module.exports = router
