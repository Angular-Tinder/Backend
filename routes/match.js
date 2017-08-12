const express = require('express')
// const Validator = require('../utilities/validator')
const Match = require('../data/Match')
const authCheck = require('../auth/middleware/auth-check')

const router = new express.Router()

router.get('/mine', authCheck, (req, res) => {
  const user = req.user

  Match.find({$or: [{'user1.user': user._id}, {'user2.user': user._id}]})
  .sort('-timestamp')
  .populate('user1.user')
  .populate('user2.user')
  .then(matches => {
    res.status(200).json(matches)
  })
  .catch(err => {
    res.status(200).json(err)
  })
})

module.exports = router
