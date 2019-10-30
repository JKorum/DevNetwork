const mongoose = require('mongoose')

const options = {
  timestamps: true
}

const commentSchema = new mongoose.Schema(
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
    wasUpdated: {
      type: Boolean,
      default: false
    },
    likes: [
      {
        owner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      }
    ]
  },
  options
)

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
    wasUpdated: {
      type: Boolean,
      default: false
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
    comments: [commentSchema]
  },
  options
)

const PostModel = mongoose.model('Post', PostSchema)

module.exports = PostModel

/*
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

*/
