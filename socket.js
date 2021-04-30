const socket = require('socket.io');
const http = require('http');

const Dialog = require('../models/Dialog');
const Message = require('../models/Message');

module.exports = (http) => {
  const io = socket(http);

  io.on('connection', function(socket) {
    // socket.on('DIALOGS:JOIN', (dialogId) => {
    //   socket.dialogId = dialogId;
    //   socket.join(dialogId);
    // });
    // socket.on('DIALOGS:TYPING', (obj) => {
    //   socket.broadcast.emit('DIALOGS:TYPING', obj);
    // });
    socket.on('NEW_MESSAGE', message => {
      console.log(message);
      // socket.to(message.dialogId).broadcast.emit('NEW_MESSAGE', message);
      io.emit('NEW_MESSAGE', message);

      async () => {
        try {
          const {messageText, dialogId, user} = message;

          const newMessage = new Message({text: messageText, dialog: dialogId, user});

      // io.emit("SERVER:NEW_MESSAGE", message);

          await newMessage.save();

          await Dialog.findByIdAndUpdate(dialogId, {lastMessage: message._id}, {upsert: true});
        } catch (e) {
          res.status(500).json({message: "Something went wrong...", status: 500});
        }
      }
    })
  });

  return io;
};