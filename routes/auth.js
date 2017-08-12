const express = require('express')
const passport = require('passport')
const Validator = require('../utilities/validator')

const router = new express.Router()

router.post('/register', (req, res, next) => {
  const validationResult = Validator.validateSignupForm(req.body)
  if (!validationResult.success) {
    return res.status(200).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    })
  }

  return passport.authenticate('local-signup', (err) => {
    if (err) {
      return res.status(200).json({
        success: false,
        message: err
      })
    }

    return res.status(200).json({
      success: true,
      message: 'You have successfully signed up! Now you should be able to log in.'
    })
  })(req, res, next)
})

router.post('/profile', (req, res) => {
  const user = req.user
  const updated = req.body

  // TODO: validate form
  user.gender = updated.gender || 'Other'
  user.interested = updated.interested || 'All'
  if (updated.name) user.name = updated.name
  if (updated.age) user.age = updated.age
  if (updated.location) user.location = updated.location

  console.log(user.gender)

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

router.post('/login', (req, res, next) => {
  const validationResult = Validator.validateLoginForm(req.body)
  if (!validationResult.success) {
    return res.status(200).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    })
  }

  return passport.authenticate('local-login', (err, token, userData) => {
    if (err) {
      if (err.name === 'IncorrectCredentialsError') {
        return res.status(200).json({
          success: false,
          message: err.message
        })
      }

      return res.status(200).json({
        success: false,
        message: 'Could not process the form.'
      })
    }

    return res.json({
      success: true,
      message: 'You have successfully logged in!',
      token,
      user: userData
    })
  })(req, res, next)
})

module.exports = router
