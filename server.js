const express = require('express')
const connectToMongo = require('./config/db')
const path = require('path')

//connect to database
connectToMongo()

const PORT = process.env.PORT || 3015
const app = express()

//register middlewares
app.use(express.json())

//define routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profiles', require('./routes/api/profiles'))
app.use('/api/posts', require('./routes/api/posts'))

//serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'build')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})
