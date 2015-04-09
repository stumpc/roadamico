'use strict';

var express = require('express');
var controller = require('./service.controller.js');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/',             controller.index);
router.get('/provider/:id', controller.listByProvider);
router.get('/category/:id', controller.listByCategory);
router.get('/:id',          controller.show);
router.post('/search',      controller.search);

router.post('/',      auth.isAuthenticated(), controller.create);
router.put('/:id',    auth.isAuthenticated(), controller.update);
router.patch('/:id',  auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
