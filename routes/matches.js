const express = require('express')
// const Validator = require('../utilities/validator')
const Match = require('../data/Match')
// const User = require('../data/User')
const authCheck = require('../auth/middleware/auth-check')

const router = new express.Router()

router.get('/mine', authCheck, (req, res) => {
  const user = req.user

  Match.find({
    $or: [{ 'user1.user': user._id }, { 'user2.user': user._id }],
    $and: [{ 'user1.active': true }, { 'user2.active': true }]
  })
    .sort('-timestamp')
    .populate('user1.user')
    .populate('user2.user')
    .then(matches => {
      res.json(matches)
    })
    .catch(err => {
      return res.json({ success: false, message: err.message })
    })
})

router.post('/unlike/:id', authCheck, (req, res) => {
  const user = req.user
  const id = req.params.id

  // Find a potential match
  Match.findOne({
    $or: [
      { $and: [{ 'user1.user': user._id }, { 'user2.user': id }] },
      { $and: [{ 'user2.user': user._id }, { 'user1.user': id }] }
    ]
  })
    .populate('user1.user')
    .populate('user2.user')
    .then(match => {
      if (!match) {
        // No such match - Error
        return res.json({ success: false, message: 'You cannot unlike this user!' })
      }

      // Match exists - Set active to true or if already true return error message
      if (match.user1.email === user.email) {
        if (!match.user1.active) {
          return res.json({
            success: false,
            message: 'You haven\'t liked this user!'
          })
        } else {
          match.user1.active = false
          match.save()
          return res.json({
            success: true,
            message: 'Your unnlike was successful!'
          })
        }
      } else {
        if (!match.user2.active) {
          return res.json({
            success: false,
            message: 'You haven\'t liked this user!'
          })
        } else {
          match.user2.active = false
          match.save()
          return res.json({
            success: true,
            message: 'Your unlike was successful!'
          })
        }
      }
    })
    .catch(err => {
      return res.json({ success: false, message: err.message })
    })
})

router.post('/like/:id', authCheck, (req, res) => {
  const user = req.user
  const id = req.params.id

  // Find a potential match
  Match.findOne({
    $or: [
      { $and: [{ 'user1.user': user._id }, { 'user2.user': id }] },
      { $and: [{ 'user2.user': user._id }, { 'user1.user': id }] }
    ]
  })
    .populate('user1.user')
    .populate('user2.user')
    .then(match => {
      if (!match) {
        // No such match - Create new Match
        return Match.create({
          user1: {
            user: user._id,
            active: true
          },
          user2: {
            user: id
          }
        })
          .then(match => {
            return res.json({
              success: true,
              message: 'Your like was successful!'
            })
          })
          .catch(err => {
            return res.json({ success: false, message: err.message })
          })
      }

      // Match exists - Set active to true or if already true return error message
      if (match.user1.email === user.email) {
        if (match.user1.active) {
          return res.json({
            success: false,
            message: 'You have already liked this user.'
          })
        } else {
          match.user1.active = true
          match.save()
          return res.json({
            success: true,
            message: 'Your like was successful!'
          })
        }
      } else {
        if (match.user2.active) {
          return res.json({
            success: false,
            message: 'You have already liked this user.'
          })
        } else {
          match.user2.active = true
          match.save()
          return res.json({
            success: true,
            message: 'Your like was successful!'
          })
        }
      }
    })
    .catch(err => {
      return res.json({ success: false, message: err.message })
    })
})

module.exports = router
