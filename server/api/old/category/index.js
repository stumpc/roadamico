'use strict';

var express = require('express');
var controller = require('./category.controller.js');

var router = express.Router();

router.get('/', controller.index);
router.get('/roots', controller.roots);
router.get('/:id', controller.show);
router.get('/:id/children', controller.children);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
