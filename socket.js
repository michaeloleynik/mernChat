// const socket = require('socket.io');
// const http = require('http');

// const uploader = require('../core/cloudinary');

// const Dialog = require('../models/Dialog');
// const Message = require('../models/Message');

// module.exports = (http) => {
//   const io = socket(http);

//   io.on('connection', function(socket) {
   
//     socket.on('NEW_MESSAGE', message => {
//       // console.log(message, 'message');
//       io.emit('NEW_MESSAGE', message);

//       async () => {
//         try {
//           const {text, dialogId, user, file} = message;
//           console.log(message, 'message');
//           // console.log(file);
//           // console.log(user);

          
            
//           const newMessage = new Message({text: text, dialog: dialogId, user, attachments: file});
//             // console.log(newMessage, 'newMessage');
      

//           await newMessage.save();

//           await Dialog.findByIdAndUpdate(dialogId, {lastMessage: message._id}, {upsert: true});
//         } catch (e) {
//           res.status(500).json({message: "Something went wrong...", status: 500});
//         }
//       }
//     })
//   });

//   return io;
// };