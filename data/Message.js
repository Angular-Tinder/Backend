const mongoose = require('mongoose')
const Types = mongoose.Schema.Types

const REQUIRED = '{PATH} is required!'

let messageSchema = new mongoose.Schema({
  from: { type: Types.ObjectId, ref: 'User', required: REQUIRED },
  to: { type: Types.ObjectId, ref: 'User', required: REQUIRED },
  message: String,
  timestamp: {type: Date, default: Date.now}
})

let Message = mongoose.model('Message', messageSchema)

module.exports = Message
