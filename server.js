const express = require('express')

const app = express()

const PORT = process.env.PORT || 3015

app.get('/', (req, res) => {
  res.send('all is ok')
})

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})
