const {Schema, model} = require('mongoose');

const schema = new Schema(
  {
    partner: { type: Schema.Types.ObjectId, ref: "User" },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    secretKey: { type: String, required: true },
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" }
    
  },
  {
    timestamps: true
  }
);

module.exports = model('Dialog', schema);