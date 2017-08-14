const mongoose = require('mongoose')
const encryption = require('../utilities/encryption')

const REQUIRED = '{PATH} is required!'

let userSchema = new mongoose.Schema({
  email: { type: String, required: REQUIRED, unique: true },
  password: { type: String, required: REQUIRED },
  name: { type: String, required: REQUIRED },
  salt: String,
  age: { type: Number, min: 18, max: 120 },
  location: String,
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' },
  interested: { type: String, enum: ['Male', 'Female', 'All'], default: 'All' },
  role: { type: String, enum: ['User', 'Admin', 'Blocked'], default: 'User' }
})

userSchema.method({
  authenticate: function (password) {
    return encryption.generateHashedPassword(this.salt, password) === this.hashedPass
  }
})

userSchema.index({email: 'text', name: 'text'})

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
      age: 20,
      gender: 'Male',
      interested: 'Female',
      salt: salt,
      password: hashedPass,
      role: 'Admin'
    })
  })
}
