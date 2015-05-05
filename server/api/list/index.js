'use strict';

var express = require('express');
var controller = require('./list.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

//router.get('/groups', auth.isAuthenticated(), controller.groupLists);
router.get('/public', controller.publicIndex);
router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id/public', controller.show);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/',      auth.isAuthenticated(), controller.create);
router.put('/:id',    auth.isAuthenticated(), controller.update);
router.patch('/:id',  auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);
router.post('/:id/entry', auth.isAuthenticated(), controller.addEntry);

module.exports = router;
