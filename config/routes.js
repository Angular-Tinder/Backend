const authRoutes = require('../routes/auth')
const matchesRoutes = require('../routes/matches')
const usersRoutes = require('../routes/users')

module.exports = (app) => {
  app.use('/auth', authRoutes)
  app.use('/matches', matchesRoutes)
  app.use('/users', usersRoutes)
}
