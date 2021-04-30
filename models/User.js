const {Schema, model} = require('mongoose');

const schema = new Schema({
  login: { type: String, required: true },
  individualLogin: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatarColor: { type: String, required: true },
  lastSeen: { type: Date, default: new Date() }
});

module.exports = model('User', schema);