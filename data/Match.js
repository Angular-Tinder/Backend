const mongoose = require('mongoose')
const Types = mongoose.Schema.Types

const REQUIRED = '{PATH} is required!'

let matchSchema = new mongoose.Schema({
  user1: {
    user: { type: Types.ObjectId, ref: 'User', required: REQUIRED },
    seen: { type: Boolean, default: false },
    active: { type: Boolean, default: false }
  },
  user2: {
    user: { type: Types.ObjectId, ref: 'User', required: REQUIRED },
    seen: { type: Boolean, default: false },
    active: { type: Boolean, default: false }
  },
  messages: [{ type: Types.ObjectId, ref: 'Message' }],
  timestamp: {type: Date, default: Date.now}
})

let Match = mongoose.model('Match', matchSchema)

module.exports = Match
