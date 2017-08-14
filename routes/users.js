const authCheck = require('../auth/middleware/auth-check')
const User = require('../data/User')
const express = require('express')

const router = new express.Router()
const PAGE_SIZE = 10

router.get('/list', authCheck, (req, res) => {
  const user = req.user
  const interested = user.interested
  const page = +req.query.page || 1
  const search = req.query.search

  let query = {
    _id: { $ne: user._id }
  }
  if (interested !== 'All') query.gender = user.interested
  if (search) query.$text = { $search: search }

  User.find(query)
  .skip((page - 1) * PAGE_SIZE)
  .limit(PAGE_SIZE)
  .then(users => {
    res.json(users)
  })
  .catch(err => {
    res.json({success: false, message: err.message})
  })
})

module.exports = router
