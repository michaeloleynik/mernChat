const socket = require('socket.io');

const Dialog = require('../models/Dialog');
const Message = require('../models/Message');
const User = require('../models/User');

// let onlineUsers = {};

const createSocket = (http) => {
  const io = socket(http, {wsEngine: 'ws'});
  let newMessageId;
  let newMessageTime;
  

  const saveInDB = async message => {
    try {
      const {text, dialogId, user, attachments} = message;
      
      const newMessage = new Message({text, dialog: dialogId, user, attachments});
     
    
      
      // console.log(newMessage);
      newMessageId = newMessage._id;
      newMessageTime = new Date().toISOString();

      await newMessage.save();

      await Dialog.findOneAndUpdate({_id: dialogId}, {lastMessage: newMessage._id}, {upsert: true});
      await User.findOneAndUpdate({_id: user}, {lastSeen: new Date()}, { upsert: true});
    } catch (e) {
      console.log('Something went wrong...');
    }
  }

  io.on('connection', function(socket) {
    socket.on('SET_ONLINE', async ({userId}) => {
      // if (onlineUsers[userId] !== socket.id) {
      //   onlineUsers[userId] = socket.id;
      // }
      
      // console.log(onlineUsers);

      await User.findOneAndUpdate({_id: userId}, {lastSeen: new Date()}, {upsert: true});
      // socket.broadcast.emit('SET_ONLINE', Object.keys(onlineUsers));
    });

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

    socket.on('disconnect', (reason) => {
      console.log('disconnected!');
      // console.log(Object.values(onlineUsers).filter(u => u === onlineUsers[socket.id]));
      // console.log(Object.keys(onlineUsers).find(key => onlineUsers[key] !== socket.id));
      
      // const leftUser = onlineUsers[socket.id];
      // const tmp = Object.values(onlineUsers).filter(u => u !== leftUser);
      // delete onlineUsers[socket.id];
      
      // socket.broadcast.emit('SET_ONLINE', Object.keys(onlineUsers).find(key => onlineUsers[key] === socket.id));
      // const leftUser = Object.keys(onlineUsers).find(key => onlineUsers[key] === socket.id);
      // delete onlineUsers[leftUser];
      
      // console.log(onlineUsers);
              
    });
  });

  return io;
};

module.exports = createSocket;