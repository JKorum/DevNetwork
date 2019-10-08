const mongoose = require('mongoose')
const { isEmail } = require('validator')

const options = {
  timestamps: true
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      validate(value) {
        return isEmail(value)
      }
    },
    password: {
      password: String,
      required: true,
      trim: true,
      minlength: 6
    },
    avatar: {
      type: Buffer
    }
  },
  options
)

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel
