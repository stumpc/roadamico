'use strict';

var express     = require('express');
var communication = require('../../components/communication');
var config = require('../../config/environment');
var router = express.Router();

router.post('/', function (req, res) {

  communication.email('contact', {
    email: config.email.adminEmail,
    view: {
      email: req.body.email,
      message: req.body.message,
      id: req.body.id || 'NA'
    }
  });

  res.send(200);

});

module.exports = router;
