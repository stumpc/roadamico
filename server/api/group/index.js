'use strict';

var express = require('express');
var controller = require('./group.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

// Public routes
router.get('/',             controller.index);
router.put('/:id/request',  controller.requestAccess);

// Admin routes
router.get('/unapproved',   auth.hasRole('admin'), controller.unapproved);
router.put('/:id/approve',  auth.hasRole('admin'), controller.approve);

// Authenticated routes
router.get('/allowed',        auth.isAuthenticated(), controller.allowed);
router.get('/mine',           auth.isAuthenticated(), controller.mine);
router.get('/own',            auth.isAuthenticated(), controller.own);
router.put('/join',           auth.isAuthenticated(), controller.join);
router.get('/:id',            auth.isAuthenticated(), controller.show);
router.get('/:id/members',    auth.isAuthenticated(), controller.members);
router.post('/',              auth.isAuthenticated(), controller.create);
router.put('/:id',            auth.isAuthenticated(), controller.update);
router.patch('/:id',          auth.isAuthenticated(), controller.update);
router.delete('/:id',         auth.isAuthenticated(), controller.destroy);
router.put('/:id/grant/:rid', auth.isAuthenticated(), controller.grantAccess);
router.put('/:id/deny/:rid',  auth.isAuthenticated(), controller.denyAccess);
router.put('/:id/invite',     auth.isAuthenticated(), controller.invite);
router.put('/:id/members/:memberId/remove', auth.isAuthenticated(), controller.removeMember);

module.exports = router;
