const express = require('express')
const authCheck = require('../auth/middleware/auth-check')
const Match = require('../data/Match')
const Message = require('../data/Message')

const router = new express.Router()

router.get('/:id', authCheck, (req, res) => {
  const user = req.user
  const id = req.params.id

  Match.findById(id)
    .populate('user1.user')
    .populate('user2.user')
    .populate({path: 'messages', populate: {path: 'from'}})
    .then(match => {
      if (!match) {
        return res.json({success: false, message: 'Invalid Match'})
      }

      if (match.user1.user.email === user.email) {
        match.user1.seen = true
      } else {
        match.user2.seen = true
      }

      match.save()

      res.json(match.messages)
    })
    .catch(err => {
      res.json({success: false, message: err.message})
    })
})

router.post('/:id/send', authCheck, (req, res) => {
  const user = req.user
  const id = req.params.id
  // const message = req.body

  Match.findById(id)
  .populate('user1.user')
  .populate('user2.user')
  // .populate({path: 'messages', populate: {path: 'from'}})
  .then(match => {
    if (!match) {
      return res.json({success: false, message: 'Invalid Match'})
    }
    const from = user._id
    let to

    if (match.user1.user.email === user.email) {
      match.user2.seen = false
      to = match.user2.user._id
    } else {
      match.user1.seen = false
      to = match.user1.user._id
    }

    Message.create({from, to, message: req.body.message}).then(message => {
      match.messages.push(message._id)

      match.save().then(updated => {
        Match.populate(updated, {path: 'messages', populate: {path: 'from'}}).then(populated => {
          res.json(populated.messages)
        })
        .catch(err => {
          res.json({success: false, message: err.message})
        })
      })
      .catch(err => {
        res.json({success: false, message: err.message})
      })
    })
    .catch(err => {
      res.json({success: false, message: err.message})
    })
  })
  .catch(err => {
    res.json({success: false, message: err.message})
  })
})

module.exports = router
