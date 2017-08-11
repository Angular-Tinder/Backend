const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport')
const localSignupStrategy = require('../auth/passport/local-signup')
const localLoginStrategy = require('../auth/passport/local-login')

module.exports = (app) => {
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(passport.initialize())
  app.use(cors())

  passport.use('local-signup', localSignupStrategy)
  passport.use('local-login', localLoginStrategy)
}
