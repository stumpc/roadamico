'use strict';

var express     = require('express');
var controller  = require('./feed.controller.js');
var auth        = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.feed);

module.exports = router;
