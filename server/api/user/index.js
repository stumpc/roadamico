'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/profiles', controller.profiles);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.post('/pic', auth.isAuthenticated(), controller.uploadImage);

// Financial endpoints
router.post('/card', auth.isAuthenticated(), controller.saveCard);
router.delete('/card/:id', auth.isAuthenticated(), controller.deleteCard);


module.exports = router;
