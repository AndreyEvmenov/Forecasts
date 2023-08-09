const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
  season: { type: String, required: true },
  tour_quantity: { type: Number, default: 30 },
  members: [{ type: Types.ObjectId, ref: 'User' }],
})

module.exports = model('Season', schema)
