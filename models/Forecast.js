const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
  score1: { type: Number, required: true },
  score2: { type: Number, required: true },
  match: { type: Types.ObjectId, ref: 'Match' },
  date: { type: Date, default: Date.now },
  owner: { type: Types.ObjectId, ref: 'User' },
})

module.exports = model('Forecast', schema)
