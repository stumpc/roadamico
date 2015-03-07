'use strict';

var express = require('express');
var controller = require('./rating.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

//router.get('/', controller.index);
router.get('/for/:id',  controller.list);
router.post('/for/:id', auth.isAuthenticated(), controller.create);
router.get('/mine',     auth.isAuthenticated(), controller.mine);

module.exports = router;
