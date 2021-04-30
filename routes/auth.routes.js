const {Router} = require('express');
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth.middleware');

const router = Router();

// /api/auth/register

router.post(
  '/registration',
  [
    check('email', 'Wrong E-mail!').isEmail(),
    check('password', 'Wrong Password, min length is 8 symbols!').isLength({min: 8}),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array(), message: "Incorrect E-mail or Password"});
      }

      const {login, email, password, individualLogin, avatarColor} = req.body;

      const modifiedLogin = `@${individualLogin}`;

      const candidateEmail = await User.findOne({ email });

      if (candidateEmail) {
        return res.status(400).json({message: "A user with the same E-mail is already exists!", status: 400});
      }

      const candidateLogin = await User.findOne({ individualLogin: modifiedLogin });

      if (candidateLogin) {
        return res.status(400).json({message: "A user with the same Individual Login is already exists!", status: 400});
      }

      const hashedPass = await bcrypt.hash(password, 8);
      
      const user = new User({login, individualLogin: modifiedLogin, email, password: hashedPass, avatarColor});

      await user.save();

      res.status(201).json({message: "The user has been created successfully!", status: 201})

    } catch (e) {
      res.status(500).json({message: "Something went wrong...", status: 500});
    }
  }
);

router.post(
  '/login',
  [
    check('email', 'Please put correct data!').normalizeEmail().isEmail(),
    check('password', 'Please put correct data!').exists()
  ], 
  async (req, res) => {
  try {
      const errors = validationResult(req);

      if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), message: "Incorrect E-mail or Password", status: 400 })
      }

      const {email, password, remember, lastSeen} = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "The user is not found!", status: 400 });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Password is not correct!", status: 400 });
      }

      await user.updateOne({ lastSeen });

      let token;
      console.log(remember);

      remember ? 
      token = jwt.sign(
        {userId: user.id},
        config.get('jwtSecret'),
        {expiresIn: '365d'}
      ) :
      token = jwt.sign(
        {userId: user.id},
        config.get('jwtSecret'),
        {expiresIn: '10s'}
      );

      res.json({token, userId: user.id, avatarColor: user.avatarColor, userLogin: user.login, individualLogin: user.individualLogin, email: user.email, message: "Success!"});

    } catch (e) {
      res.status(500).json({message: "Something went wrong..."});
    }
  }
);

router.get(
  '/checkAuth',
  auth,
  async (req, res) => {
    try{
      res.status(200).json({message: 'OK', status: 200});
    } catch (e) {
      res.status(500).json({message: "Something went wrong..."});
    }
  }
)

module.exports = router;