const express = require('express')
const { validationResult } = require('express-validator')
const PostModel = require('../../models/Post')
const UserModel = require('../../models/User')
const ProfileModel = require('../../models/Profile')
const auth = require('../../utils/auth')
const { postValidation } = require('../../utils/validation-middlewares')

const router = express.Router()

//@route   POST api/posts
//@desc    create post
//@access  private
router.post('/', auth, postValidation, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() })
  }
  try {
    const { userId, text } = req.body
    const user = await UserModel.findById(userId).select('-password')
    const { name, avatar } = user
    let post = new PostModel({
      owner: userId,
      text,
      ownerName: name,
      avatar
    })
    post = await post.save()
    res.status(201).send(post)
  } catch (err) {
    console.log(err)
    res.status(500).send({ errors: [{ msg: 'server error' }] })
  }
})

//@route   GET api/posts
//@desc    get all posts
//@access  private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: 'desc' })
    if (posts.length === 0) {
      return res.status(404).send({ errors: [{ msg: 'posts not found' }] })
    }
    res.status(200).send(posts)
  } catch (err) {
    console.log(err)
    res.status(500).send({ errors: [{ msg: 'server error' }] })
  }
})

//@route   GET api/posts/:id
//@desc    get post by id
//@access  private
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const post = await PostModel.findById(id)

    if (!post) {
      return res.status(404).send({ errors: [{ msg: 'post not found' }] })
    }
    res.status(200).send(post)
  } catch (err) {
    console.log(err)
    if (err.kind === 'ObjectId') {
      return res.status(404).send({ errors: [{ msg: 'post not found' }] })
    }
    res.status(500).send({ errors: [{ msg: 'server error' }] })
  }
})

//@route   DELETE api/posts/:id
//@desc    delete post by id
//@access  private
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const post = await PostModel.findById(id)
    if (!post) {
      return res.status(404).send({ errors: [{ msg: 'post not found' }] })
    }
    //check if user is owner
    if (post.owner.toString() !== req.body.userId.toString()) {
      return res.status(403).send({ errors: [{ msg: 'access forbidden' }] })
    }
    await post.remove()
    res.status(204).send()
  } catch (err) {
    console.log(err)
    if (err.kind === 'ObjectId') {
      return res.status(404).send({ errors: [{ msg: 'post not found' }] })
    }
    res.status(500).send({ errors: [{ msg: 'server error' }] })
  }
})

module.exports = router
