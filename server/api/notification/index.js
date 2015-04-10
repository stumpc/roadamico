'use strict';

var express = require('express');
var controller = require('./notification.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/',         auth.isAuthenticated(), controller.index);
router.put('/:id/mark', auth.isAuthenticated(), controller.mark);

module.exports = router;
