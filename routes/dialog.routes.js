const {Router} = require('express');

const socket = require('socket.io');

const Dialog = require('../models/Dialog');
const User = require('../models/User');
const Message = require('../models/Message');

const auth = require('../middleware/auth.middleware');

const crypto = require('crypto-js'); 

const router = Router();

router.post(
  '/createDialog',
  async (req, res) => {
    try {
      const {partnerLogin, currentMessage, authorId} = req.body;
      // console.log(typeof currentMessage);

      const io = req.app.get('socketIO');

      await User.findOneAndUpdate({_id: authorId}, {lastSeen: new Date()});
      
      const data = await User.findOne({individualLogin: `@${partnerLogin}`});
      const partnerId = data._id;

      const candidateDialog = await Dialog.findOne({$or: [{author: authorId, partner: partnerId}, {author: partnerId, partner: authorId}]});

      if (candidateDialog) {
        return res.status(400).json({message: "Current Dialog is already exists!", status: 400});
      }

      const secretKey = crypto.SHA256(`${authorId}${partnerId}${(Math.random()) * 10000}`);
      // const secureMessage = crypto.AES.encrypt(currentMessage, secretKey).toString();
      // console.log(secretKey.toString());

      const dialog = new Dialog({author: authorId, partner: partnerId, secretKey});
      // const secureMessage = crypto.AES.encrypt(currentMessage, secretKey.toString()).toString();
      
      dialog.save().then(dialogObj => {        
        const message = new Message({text: currentMessage, dialog: dialogObj._id, user: authorId});
        message.save().then(() => {
          dialogObj.lastMessage = message._id;
          dialogObj.save().then(() => {
            res.status(201).json({dialogObj, status: 201});
            io.emit('SERVER:DIALOG_CREATED', {dialog: dialogObj});
          });
        }); 
      });
    } catch (e) {
      res.status(500).json({message: "Something went wrong...", status: 500});
    }
  }
)

router.post(
  '/addMessage',
  async (req, res) => {
    try {
      // const {messageText, dialogId, user} = req.body;
      // const io = req.app.get('socketIO');

      // const message = new Message({text: messageText, dialog: dialogId, user});

      // io.emit("NEW_MESSAGE", message);

      // await message.save();

      // await Dialog.findByIdAndUpdate(dialogId, {lastMessage: message._id}, {upsert: true});

      // res.status(201).json({message: "Success!", status: 201});

      
    } catch (e) {
      res.status(500).json({message: "Something went wrong...", status: 500});
    }
  }
)

router.get(
  '/getFilteredUsers',
  async (req, res) => {
    try {
      const partnerLogin = req.query.query;
      // console.log(req.query);
      const individualLogin = `@${partnerLogin}`;
      const data = await User.find({individualLogin: new RegExp(individualLogin, 'i')});
      const out = data.map(d => {
        return {
          id: d._id,
          login: d.login,
          individualLogin: d.individualLogin
        }
      });
      res.status(201).json({out});
    } catch (e) {
      res.status(500).json({message: "Something went wrong...", status: 500});
    }
  }
)

router.get(
  '/getAllDialogs',
  auth,
  async (req, res) => {
    try {
      const {userId} = req.user;

      await Dialog.find({ 
        $or: [
          { author: userId },
          { partner: userId }
        ] 
      }, (err, items) => {
        let f = items.map(async (i) => {
          const authorId = String(i['author']);
          const partnerId = String(i['partner']);

          const lastMessage = await Message.findOne({_id: i.lastMessage});
  

          if (authorId === userId) {
            const founded = await User.findOne({_id: partnerId});
            // console.log(founded);

            return {id: i._id, author: i.author, partner: founded, secretKey: i.secretKey,  lastMessage, updatedAt: i.updatedAt}

          } else if (partnerId === userId) {
            const founded = await User.findOne({_id: authorId})
            // console.log(founded);

            return {id: i._id, author: i.author, partner: founded, secretKey: i.secretKey, lastMessage, updatedAt: i.updatedAt}
          }
        })
        Promise.all(f).then(resp => {
          return res.status(201).json(resp);
        })
      }) 
    } catch (e) {
      res.status(500).json({message: "Something went wrong...", status: 500});   
    }
  }
)

router.get(
  '/getCurrentDialogMessages',
  async (req, res) => {
    try {
      const dialogId = req.query.query;
      // const page = req.query.page ? parseInt(req.query.page) : 0;
      // console.log(page);

      // const data = await Message.find({dialog: dialogId}).sort({createdAt: 'desc'}).skip((page - 1) * 20).limit(20);
      // console.log(!!data);
      const data = await Message.find({dialog: dialogId});
      res.status(201).json(data);
    } catch (e) {
      res.status(500).json({message: "Something went wrong...", status: 500});   
    }
  }
)

module.exports = router;