'use strict';

var express = require('express');
var controller = require('./util.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/embed/:url', auth.isAuthenticated(), controller.embed);
router.post('/upload',    auth.isAuthenticated(), controller.uploadImage);
router.post('/upload-file',    auth.isAuthenticated(), controller.uploadRawFile);

module.exports = router;