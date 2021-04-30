const socket = require('socket.io');

const Dialog = require('../models/Dialog');
const Message = require('../models/Message');

// let onlineUsers = [];

const createSocket = (http) => {
  const io = socket(http);
  let newMessageId;
  let newMessageTime;

  const saveInDB = async message => {
    try {
      const {text, dialogId, user} = message;
      // console.log(text);

      const newMessage = new Message({text, dialog: dialogId, user});
      console.log(newMessage);
      newMessageId = newMessage._id;
      newMessageTime = new Date().toISOString();


      await newMessage.save();

      await Dialog.findOneAndUpdate({_id: dialogId}, {lastMessage: newMessage._id}, {upsert: true});
    } catch (e) {
      console.log('Something went wrong...');
    }
  }

  io.on('connection', function(socket) {
    // socket.on('SET_ONLINE', ({userId}) => {
    //   onlineUsers = [...onlineUsers, {userId, isOnline: true, socketId: socket.id}];
    //   io.emit('SET_ONLINE', {userId, isOnline: true});
    // });

    socket.on('DIALOGS:JOIN', ({dialogId}) => {
      socket.dialogId = dialogId;
      socket.join(dialogId);
    });
    socket.on('DIALOGS:TYPING', (obj) => {
      console.log(obj);
      socket.broadcast.emit('DIALOGS:TYPING', obj);
    });

    socket.on('NEW_MESSAGE', message => {
      saveInDB(message);
      console.log(message);

      io.emit('NEW_MESSAGE', {...message, _id: newMessageId, createdAt: newMessageTime});
    });

    socket.on('disconnect', () => console.log('disconnected'))
  });

  return io;
};

module.exports = createSocket;