const express = require('express');

const authRoutes = require('./auth.routes');
const dialogRoutes = require('./dialog.routes');

const {check} = require('express-validator');

const createRoutes = (app, io) => {
  const {registration} = authRoutes;
  const dialogCtrl = dialogRoutes(io);

  app.use(express.json({extended: true}));

  app.post(
    '/registration',
    [
      check('email', 'Wrong E-mail!').isEmail(),
      check('password', 'Wrong Password, min length is 8 symbols!').isLength({min: 8}),
    ], 
    registration()
  )
}

module.exports = createRoutes;