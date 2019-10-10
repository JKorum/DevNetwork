const mongoose = require('mongoose')
const config = require('config')

const connectToMongo = async () => {
  try {
    if (config.has('mongoURL')) {
      const dbURL = config.get('mongoURL')
      await mongoose.connect(dbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
      })
      console.log('connected to database...')
    } else {
      throw new Error('database URL not accessible')
    }
  } catch (err) {
    console.log(err.message)
    process.exit(1)
  }
}

module.exports = connectToMongo
