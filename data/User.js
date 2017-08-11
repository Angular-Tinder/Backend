const mongoose = require('mongoose')
const encryption = require('../utilities/encryption')

const REQUIRED = '{PATH} is required!'

let userSchema = new mongoose.Schema({
  email: { type: String, required: REQUIRED, unique: true },
  password: { type: String, required: REQUIRED },
  salt: String,
  name: { type: String, required: REQUIRED },
  age: Number,
  location: String,
  roles: [String]
})

userSchema.method({
  authenticate: function (password) {
    return encryption.generateHashedPassword(this.salt, password) === this.hashedPass
  }
})

let User = mongoose.model('User', userSchema)

module.exports = User

module.exports.seedAdminUser = () => {
  User.find({}).then((users) => {
    if (users.length > 0) {
      return
    }
    let salt = encryption.generateSalt()
    let hashedPass = encryption.generateHashedPassword(salt, 'Admin')
    User.create({
      email: 'admin@admin.com',
      name: 'Admin',
      salt: salt,
      password: hashedPass,
      roles: ['Admin']
    })
  })
}
