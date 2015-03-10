'use strict';

var express     = require('express');
var controller  = require('./availability.controller');
var auth        = require('../../auth/auth.service');

var router = express.Router();

router.get('/mine',       auth.isAuthenticated(), controller.mine);
router.get('/offering',   auth.isAuthenticated(), controller.offering);
router.post('/',          auth.isAuthenticated(), controller.create);
router.post('/repeat',    auth.isAuthenticated(), controller.createRepeat);
router.put('/:id',        auth.isAuthenticated(), controller.update);
router.patch('/:id',      auth.isAuthenticated(), controller.update);
router.put('/:id/book',   auth.isAuthenticated(), controller.book);
router.put('/:id/cancel', auth.isAuthenticated(), controller.cancel);
router.delete('/:id',     auth.isAuthenticated(), controller.destroy);

router.get('/upcoming/:id', controller.getUpcoming);
router.get('/all/:id',      controller.getAll);
router.get('/:id',          controller.show);

module.exports = router;
