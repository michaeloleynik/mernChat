const {Schema, model} = require('mongoose');

const dfns = require('date-fns');

const schema = new Schema({
  login: { type: String, required: true },
  individualLogin: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatarColor: { type: String, required: true },
  lastSeen: { type: Date, default: new Date() }
});

schema.virtual("isOnline").get(function() {
  return dfns.differenceInMinutes(new Date(), this.lastSeen) < 5;
});

schema.set("toJSON", {
  virtuals: true,
});

module.exports = model('User', schema);