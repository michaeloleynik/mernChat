const User = require('../models/User');

module.exports = async (req, res, next) => {
  console.log(req.user);
  if (req.user) {
    
    await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        lastSeen: new Date(),
      },
      { new: true },
    );
  }
  next();
};