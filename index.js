const app = require('express')()

let env = process.env.NODE_ENV || 'development'
const settings = require('./config/settings')[env]

require('./config/express')(app)
require('./config/routes')(app)
require('./config/database')(settings)

app.listen(settings.port, () => {
  console.log(`Server running on port ${settings.port}...`)
})
