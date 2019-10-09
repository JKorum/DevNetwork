const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcryptjs')

const options = {
  timestamps: true
}

const tokenSchema = new mongoose.Schema({
  token: String
})

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minlength: 2
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
      type: String,
      required: true,
      trim: true,
      minlength: 6
    },
    tokens: [tokenSchema],
    avatar: {
      type: Buffer
    }
  },
  options
)

userSchema.pre('save', async function() {
  console.log('hook triggered')
  const user = this
  try {
    const salt = await bcrypt.genSalt(8)
    user.password = await bcrypt.hash(user.password, salt)
  } catch (err) {
    throw err
  }
})

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel
