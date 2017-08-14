const authCheck = require('../auth/middleware/auth-check')
const User = require('../data/User')
const express = require('express')

const router = new express.Router()

router.get('/list', authCheck, (req, res) => {
  const user = req.user
  const interested = user.interested

  let query = {
    _id: { $ne: user._id }
  }
  if (interested !== 'All') {
    query.gender = user.interested
  }

  User.find(query)
  .then(users => {
    res.json(users)
  })
  .catch(err => {
    res.json({success: false, message: err.message})
  })
})

module.exports = router
