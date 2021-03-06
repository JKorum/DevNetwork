require('dotenv').config()

module.exports = {
  mongoURL: process.env.MONGO_URL,
  tokenSign: process.env.TOKEN_SIGN,
  gitId: process.env.GIT_ID,
  gitSecret: process.env.GIT_SECRET,
  sendGrid: process.env.SENDGRID_API_KEY,
  mail: process.env.MAIL
}
