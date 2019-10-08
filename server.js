const express = require('express')
const connectToMongo = require('./config/db')

//connect to database
connectToMongo()

const PORT = process.env.PORT || 3015
const app = express()

//define routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})
