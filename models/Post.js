const mongoose = require('mongoose')

const options = {
  timestamps: true
}

const PostSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: {
      type: String,
      required: true
    },
    ownerName: {
      type: String
    },
    avatar: {
      type: String
    },
    likes: [
      {
        owner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      }
    ],
    comments: [
      {
        owner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        text: {
          type: String,
          required: true
        },
        ownerName: {
          type: String
        },
        avatar: {
          type: String
        },
        date: {
          type: Date,
          dafault: Date.now
        }
      }
    ]
  },
  options
)

const PostModel = mongoose.model('Post', PostSchema)

module.exports = PostModel
