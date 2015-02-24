'use strict';

var express = require('express');
var controller = require('./message.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index); // TODO: Remove this after dev

router.get('/sent',     auth.isAuthenticated(), controller.sent);
router.get('/received', auth.isAuthenticated(), controller.received);
router.get('/mine',     auth.isAuthenticated(), controller.mine);
router.get('/:id',      auth.isAuthenticated(), controller.show);
router.post('/',        auth.isAuthenticated(), controller.create);
router.put('/:id',      auth.isAuthenticated(), controller.mark);
router.patch('/:id',    auth.isAuthenticated(), controller.mark);
//router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
