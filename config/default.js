require('dotenv').config()

module.exports = {
  mongoURL: process.env.MONGO_URL,
  tokenSign: process.env.TOKEN_SIGN
}
