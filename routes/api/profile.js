const express = require('express')

const router = express.Router()

//@route   GET api/profile
//@desc    test route
//@access  public
router.get('/', (req, res) => {
  res.send('profile is ok')
})

module.exports = router
