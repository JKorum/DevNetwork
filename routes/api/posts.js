const express = require('express')
const { validationResult } = require('express-validator')
const PostModel = require('../../models/Post')
const UserModel = require('../../models/User')
const ProfileModel = require('../../models/Profile')
const auth = require('../../utils/auth')
const {
  postAndCommentValidation
} = require('../../utils/validation-middlewares')

const router = express.Router()

//@route   POST api/posts
//@desc    create post
//@access  private
router.post('/', auth, postAndCommentValidation, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() })
  }
  try {
    const { userId, text } = req.body
    const user = await UserModel.findById(userId).select('-password')
    const { name } = user

    let post = new PostModel({
      owner: userId,
      text,
      ownerName: name
    })
    post = await post.save()
    await post
      .populate({
        path: 'owner',
        select: ['_id', 'useImage', 'image', 'avatar']
      })
      .execPopulate()

    res.status(201).send(post)
  } catch (err) {
    console.log(err)
    res.status(500).send({ errors: [{ msg: 'server error' }] })
  }
})

//@route   PATCH api/posts/:id
//@desc    update post
//@access  private
router.patch('/:id', auth, postAndCommentValidation, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() })
  }
  try {
    const { userId, text } = req.body
    const { id } = req.params
    // check if post exists & user is its owner
    const post = await PostModel.findOne({ _id: id, owner: userId })
    if (!post) {
      return res.status(404).send({ errors: [{ msg: 'post not found' }] })
    }
    // update & send updated post
    post.text = text
    post.wasUpdated = true
    await post.save()

    await post
      .populate({
        path: 'owner',
        select: ['_id', 'useImage', 'image', 'avatar']
      })
      .execPopulate()

    await Promise.all(
      post.comments.map((comment, index) =>
        post
          .populate({
            path: `comments.${index}.owner`,
            select: ['_id', 'useImage', 'image', 'avatar']
          })
          .execPopulate()
      )
    )

    res.status(200).send(post)
  } catch (err) {
    console.log(err)
    if (err.name === 'ValidationError' || err.kind === 'ObjectId') {
      return res.status(404).send({ errors: [{ msg: 'resource not found' }] })
    }
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
    // populate posts `owner` field
    const populated = await Promise.all(
      posts.map(post =>
        post
          .populate({
            path: 'owner',
            select: ['_id', 'useImage', 'image', 'avatar']
          })
          .execPopulate()
      )
    )

    // populate `owner` field in each comment in each post
    await Promise.all(
      populated.map(post => {
        return Promise.all(
          post.comments.map((comment, index) =>
            post
              .populate({
                path: `comments.${index}.owner`,
                select: ['_id', 'useImage', 'image', 'avatar']
              })
              .execPopulate()
          )
        )
      })
    )
    // Mongoose does not support calling populate() on nested docs. Instead of `doc.arr[0].populate("path")`, use `doc.populate("arr.0.path")`

    res.status(200).send(populated)
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
    await post
      .populate({
        path: 'owner',
        select: ['_id', 'useImage', 'image', 'avatar']
      })
      .execPopulate()

    await Promise.all(
      post.comments.map((comment, index) =>
        post
          .populate({
            path: `comments.${index}.owner`,
            select: ['_id', 'useImage', 'image', 'avatar']
          })
          .execPopulate()
      )
    )

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

//@route   PATCH api/posts/:id/likes
//@desc    add & remove like
//@access  private
router.patch('/:id/likes', auth, async (req, res) => {
  try {
    const { id } = req.params
    const { userId } = req.body
    const post = await PostModel.findById(id)
    if (!post) {
      return res.status(404).send({ errors: [{ msg: 'post not found' }] })
    }
    //check if user've already liked this post
    const index = post.likes.findIndex(
      like => like.owner.toString() === userId.toString()
    )
    if (index === -1) {
      //they haven't -> add like
      post.likes.push({ owner: userId })
      await post.save()
      res.status(200).send(post.likes)
    } else {
      //they have -> remove like
      post.likes.pull({ _id: post.likes[index]._id })
      await post.save()
      res.status(200).send(post.likes)
    }
  } catch (err) {
    console.log(err)
    if (err.kind === 'ObjectId') {
      return res.status(404).send({ errors: [{ msg: 'post not found' }] })
    }
    res.status(500).send({ errors: [{ msg: 'server error' }] })
  }
})

//@route   PUT api/posts/:post_id/comments
//@desc    add comment
//@access  private
router.patch(
  '/:post_id/comments',
  auth,
  postAndCommentValidation,
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).send({ errors: errors.array() })
    }
    try {
      const { userId, text } = req.body
      const { post_id } = req.params
      const post = await PostModel.findById(post_id)
      if (!post) {
        return res.status(404).send({ errors: [{ msg: 'post not found' }] })
      }
      const user = await UserModel.findById(userId)
      //add comment
      post.comments.unshift({
        owner: userId,
        text,
        ownerName: user.name
      })
      await post.save()

      // Mongoose does not support calling populate() on nested docs. Instead of `doc.arr[0].populate("path")`, use `doc.populate("arr.0.path")`
      await Promise.all(
        post.comments.map((comment, index) =>
          post
            .populate({
              path: `comments.${index}.owner`,
              select: ['_id', 'useImage', 'image', 'avatar']
            })
            .execPopulate()
        )
      )

      res.status(201).send(post.comments)
    } catch (err) {
      console.log(err)
      if (err.kind === 'ObjectId') {
        return res.status(404).send({ errors: [{ msg: 'post not found' }] })
      }
      res.status(500).send({ errors: [{ msg: 'server error' }] })
    }
  }
)

//@route   PATCH api/posts/:post_id/comments/:comment_id
//@desc    update comment
//@access  private
router.patch(
  '/:post_id/comments/:comment_id',
  auth,
  postAndCommentValidation,
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).send({ errors: errors.array() })
    }
    try {
      const { userId, text } = req.body
      console.log(req.body)
      const { post_id, comment_id } = req.params

      //check for post
      const post = await PostModel.findById(post_id)
      if (!post) {
        return res.status(404).send({ errors: [{ msg: 'post not found' }] })
      }
      //check for comment
      const index = post.comments.findIndex(comment => {
        return (
          comment.owner.toString() === userId.toString() &&
          comment._id.toString() === comment_id
        )
      })
      if (index === -1) {
        return res.status(404).send({ errors: [{ msg: 'comment not found' }] })
      }
      //update comment
      post.comments[index].text = text
      post.comments[index].wasUpdated = true
      await post.save()

      await post
        .populate({
          path: `comments.${index}.owner`,
          select: ['_id', 'useImage', 'image', 'avatar']
        })
        .execPopulate()

      res.status(200).send(post.comments[index])
    } catch (err) {
      console.log(err)
      if (err.name === 'ValidationError' || err.kind === 'ObjectId') {
        return res.status(404).send({ errors: [{ msg: 'resource not found' }] })
      }
      res.status(500).send({ errors: [{ msg: 'server error' }] })
    }
  }
)

//@route   DELETE api/posts/:post_id/comments/:comment_id
//@desc    remove comment
//@access  private
router.delete('/:post_id/comments/:comment_id', auth, async (req, res) => {
  try {
    const { userId } = req.body
    const { post_id, comment_id } = req.params
    //check for post
    const post = await PostModel.findById(post_id)
    if (!post) {
      return res.status(404).send({ errors: [{ msg: 'post not found' }] })
    }
    //check for comment
    const index = post.comments.findIndex(comment => {
      return (
        comment.owner.toString() === userId.toString() &&
        comment._id.toString() === comment_id
      )
    })
    if (index === -1) {
      return res.status(404).send({ errors: [{ msg: 'comment not found' }] })
    }
    //remove comment
    post.comments.pull({ _id: comment_id })
    await post.save()

    // Mongoose does not support calling populate() on nested docs. Instead of `doc.arr[0].populate("path")`, use `doc.populate("arr.0.path")`
    await Promise.all(
      post.comments.map((comment, index) =>
        post
          .populate({
            path: `comments.${index}.owner`,
            select: ['_id', 'useImage', 'image', 'avatar']
          })
          .execPopulate()
      )
    )

    res.status(200).send(post.comments)
  } catch (err) {
    console.log(err)
    if (err.name === 'ValidationError') {
      return res.status(404).send({ errors: [{ msg: 'resource not found' }] })
    }
    res.status(500).send({ errors: [{ msg: 'server error' }] })
  }
})

//@route   PATCH api/posts/:post_id/comments/:comment_id/likes
//@desc    add & remove like to the comment
//@access  private
router.patch('/:post_id/comments/:comment_id/likes', auth, async (req, res) => {
  try {
    const { post_id } = req.params
    const { comment_id } = req.params
    const { userId } = req.body

    // check if post exists
    const post = await PostModel.findById(post_id)
    if (!post) {
      return res.status(404).send({ errors: [{ msg: 'post not found' }] })
    }
    // check if comment exists
    if (!post.comments.length > 0) {
      return res.status(404).send({ errors: [{ msg: 'comment not found' }] })
    }
    const comment_index = post.comments.findIndex(
      comment => comment._id.toString() === comment_id
    )
    if (comment_index === -1) {
      return res.status(404).send({ errors: [{ msg: 'comment not found' }] })
    }
    // check if user have already liked this comment
    const like_index = post.comments[comment_index].likes.findIndex(
      like => like.owner.toString() === userId.toString()
    )
    if (like_index === -1) {
      // they haven't -> add like
      post.comments[comment_index].likes.push({ owner: userId })
      await post.save()
      res.status(200).send(post.comments[comment_index].likes)
    } else {
      // they haven -> remove like
      post.comments[comment_index].likes.pull({
        _id: post.comments[comment_index].likes[like_index]._id
      })
      await post.save()
      res.status(200).send(post.comments[comment_index].likes)
    }
  } catch (err) {
    console.log(err)
    if (err.kind === 'ObjectId') {
      return res.status(404).send({ errors: [{ msg: 'resource not found' }] })
    }
    res.status(500).send({ errors: [{ msg: 'server error' }] })
  }
})

module.exports = router
