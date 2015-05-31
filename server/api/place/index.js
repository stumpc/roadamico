'use strict';

var express = require('express');
var controller = require('./place.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/',       controller.index);
router.get('/:id',    controller.show);
router.post('/', auth.isAuthenticated(),     controller.create);
router.put('/:id',  auth.isAuthenticated(),  controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

router.post('/:id/feed',        auth.isAuthenticated(), controller.addEntry);
router.post('/:id/save-feed-photo',        auth.isAuthenticated(), controller.saveEntryPhoto);
router.delete('/:id/feed/:index', auth.isAuthenticated(), controller.removePost);
router.post('/:id/rate',        auth.isAuthenticated(), controller.rate);

module.exports = router;
