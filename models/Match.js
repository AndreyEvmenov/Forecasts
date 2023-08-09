const { Schema, model } = require('mongoose')

const schema = new Schema({
  date: { type: Date, default: Date.now },
  tour: { type: Number, default: 0 },
  season: { type: String, required: true },
  team1: { type: String, required: true },
  team2: { type: String, required: true },
  score1: { type: Number, default: -1 },
  score2: { type: Number, default: -1 },
})

module.exports = model('Match', schema)
