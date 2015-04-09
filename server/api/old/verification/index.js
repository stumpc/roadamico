
var express = require('express');
var controller = require('./verification.controller.js');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/pending', auth.hasRole('admin'), controller.getUsersByStatus('pending'));
router.get('/approved', auth.hasRole('admin'), controller.getUsersByStatus('approved'));
router.get('/denied', auth.hasRole('admin'), controller.getUsersByStatus('denied'));

router.put('/approve/:id', auth.hasRole('admin'), controller.setStatus('approved'));
router.put('/deny/:id', auth.hasRole('admin'), controller.setStatus('denied'));

router.post('/', auth.isAuthenticated(), controller.submit);


module.exports = router;
