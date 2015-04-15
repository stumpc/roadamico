'use strict';

var express = require('express');
var controller = require('./place.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/',       controller.index);
router.get('/:id',    controller.show);
router.post('/',      controller.create);
router.put('/:id',    controller.update);
router.patch('/:id',  controller.update);
router.delete('/:id', controller.destroy);

router.post('/:id/photo',             auth.isAuthenticated(), controller.addPhoto);
router.delete('/:id/photo/:photoId',  auth.isAuthenticated(), controller.removePhoto);
router.post('/:id/rate',              auth.isAuthenticated(), controller.rate);

module.exports = router;
