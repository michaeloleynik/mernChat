const {Schema, model} = require('mongoose');

const schema = new Schema(
  {
    text: { type: String, require: Boolean },
    dialog: { type: Schema.Types.ObjectId, ref: "Dialog", require: true },
    user: { type: Schema.Types.ObjectId, ref: "User", require: true },
    read: {
      type: Boolean,
      default: false,
    },
    attachments: [{ type: String }],
  },
  {
    timestamps: true,
    usePushEach: true
  }
);

module.exports = model('Message', schema);