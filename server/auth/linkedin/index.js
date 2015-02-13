'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router
  .get('/', passport.authenticate('linkedin', {
    scope: ['r_basicprofile'],
    failureRedirect: '/signup',
    session: false
  }))

  .get('/callback', passport.authenticate('linkedin', {
    failureRedirect: '/signup',
    session: false
  }), auth.setTokenCookie);

module.exports = router;
