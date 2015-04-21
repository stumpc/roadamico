'use strict';

var express = require('express');
var controller = require('./event.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/place/:id',  controller.index);
router.get('/:id',        controller.show);
router.post('/',          auth.isAuthenticated(), controller.create);
router.put('/:id',        auth.isAuthenticated(), controller.update);
router.patch('/:id',      auth.isAuthenticated(), controller.update);
router.put('/:id/cancel', auth.isAuthenticated(), controller.cancel);
router.put('/:id/join',   auth.isAuthenticated(), controller.join);
router.put('/:id/unjoin', auth.isAuthenticated(), controller.unjoin);
router.post('/:id/message', auth.isAuthenticated(), controller.message);

module.exports = router;
