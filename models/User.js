const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'user' },
  name: { type: String, required: true, default: 'name' },
  links: [{ type: Types.ObjectId, ref: 'Link' }],
})

module.exports = model('User', schema)
