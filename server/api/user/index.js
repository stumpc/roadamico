'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

// Admin routes
router.get('/',             auth.hasRole('admin'), controller.index);
router.delete('/:id',       auth.hasRole('admin'), controller.destroy);

// User routes
router.put('/password',     auth.isAuthenticated(), controller.changePassword);
router.put('/',             auth.isAuthenticated(), controller.update);
router.put('/:id',          auth.isAuthenticated(), controller.update);
router.get('/me',           auth.isAuthenticated(), controller.me);
router.post('/pic',         auth.isAuthenticated(), controller.uploadImage);
router.post('/card',        auth.isAuthenticated(), controller.saveCard);
router.delete('/card/:id',  auth.isAuthenticated(), controller.deleteCard);

// Public routes
router.get('/profiles', controller.profiles);
router.post('/reset',   controller.resetPassword);
router.get('/:id',      controller.show);
router.post('/',        controller.create);

module.exports = router;
