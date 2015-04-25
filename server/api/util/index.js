'use strict';

var express = require('express');
var controller = require('./util.controller');

var router = express.Router();

router.get('/embed/:url', controller.embed);

module.exports = router;
