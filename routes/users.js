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

router.post('/profile', authCheck, (req, res) => {
  const user = req.user
  const updated = req.body

  if (updated.gender) user.gender = updated.gender
  if (updated.interested) user.interested = updated.interested
  if (updated.name) user.name = updated.name
  if (updated.age) user.age = updated.age
  if (updated.location) user.location = updated.location

  user.save()
    .then(updated => {
      res.json({
        success: true,
        message: 'Profile updated successfully',
        updated
      })
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message
      })
    })
})

router.get('/profile', authCheck, (req, res) => {
  res.json(req.user)
})

router.get('/profile/:id', authCheck, (req, res) => {
  const id = req.params.id

  User.findById(id).then(user => {
    if (!user) {
      return req.json({success: false, message: 'No such user exists!'})
    }

    res.json(user)
  })
  .catch(err => {
    res.json({success: false, message: err.message})
  })
})

module.exports = router
