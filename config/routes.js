const authRoutes = require('../routes/auth')
const matchesRoutes = require('../routes/match')

module.exports = (app) => {
  app.use('/auth', authRoutes)
  app.use('/matches', matchesRoutes)
}
