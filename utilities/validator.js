const validator = require('validator')

module.exports = class Validator {
  static validateSignupForm (payload) {
    const errors = {}
    let isFormValid = true
    let message = ''

    if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
      isFormValid = false
      errors.email = 'Please provide a correct email address.'
    }

    if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 4) {
      isFormValid = false
      errors.password = 'Password must have at least 4 characters.'
    }

    if (!payload || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
      isFormValid = false
      errors.name = 'Please provide your name.'
    }

    if (!isFormValid) {
      message = 'Check the form for errors.'
    }

    return {
      success: isFormValid,
      message,
      errors
    }
  }

  static validateLoginForm (payload) {
    const errors = {}
    let isFormValid = true
    let message = ''

    if (!payload || typeof payload.email !== 'string' || payload.email.trim().length === 0) {
      isFormValid = false
      errors.email = 'Please provide your email address.'
    }

    if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
      isFormValid = false
      errors.password = 'Please provide your password.'
    }

    if (!isFormValid) {
      message = 'Check the form for errors.'
    }

    return {
      success: isFormValid,
      message,
      errors
    }
  }
}
