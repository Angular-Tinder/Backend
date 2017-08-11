const PassportLocalStrategy = require('passport-local').Strategy
const User = require('../../data/User')
const encryption = require('../../utilities/encryption')

module.exports = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, email, password, done) => {
  const user = {
    email: email.trim(),
    password: password.trim(),
    name: req.body.name.trim()
  }

  User
    .findOne({email: user.email})
    .then(userFound => {
      if (!userFound) {
        let salt = encryption.generateSalt()
        let hashedPassword = encryption.generateHashedPassword(salt, user.password)
        User
          .create({
            email: user.email,
            password: hashedPassword,
            salt: salt,
            name: user.name,
            roles: ['User']
          })
          .then(userCreated => {
            return done(null)
          })
          .catch(err => {
            console.log(err)
            return done('Error in creating user')
          })
      } else {
        return done('E-mail already exists!')
      }
    })
    .catch(err => {
      console.log(err)
      return done('Error in creating user')
    })
})
