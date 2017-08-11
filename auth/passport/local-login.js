const jwt = require('jsonwebtoken')
const User = require('../../data/User')
const encryption = require('../../utilities/encryption')
const PassportLocalStrategy = require('passport-local').Strategy

module.exports = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, email, password, done) => {
  const user = {
    email: email.trim(),
    password: password.trim()
  }

  User
    .findOne({email: user.email})
    .then(savedUser => {
      if (!savedUser) {
        const error = new Error('Incorrect email or password')
        error.name = 'IncorrectCredentialsError'
        return done(error)
      }

      let hashedPass = encryption.generateHashedPassword(savedUser.salt, user.password)
      const isMatch = savedUser.password === hashedPass
      if (!isMatch) {
        const error = new Error('Incorrect email or password')
        error.name = 'IncorrectCredentialsError'
        return done(error)
      }

      if (savedUser.isBlocked) {
        const error = new Error('Unauthorized.')
        error.name = 'IncorrectCredentialsError'
        return done(error)
      }

      const payload = {
        sub: savedUser._id
      }

      // create a token string
      const token = jwt.sign(payload, 's0m3 r4nd0m str1ng')
      const data = {
        email: savedUser.email,
        name: savedUser.name,
        roles: savedUser.roles
      }
      return done(null, token, data)
    })
    .catch(err => {
      console.log(err)
      const error = new Error('Error while logging in')
      return done(error)
    })
})
