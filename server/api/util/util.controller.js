'use strict';

var _ = require('lodash');
var embedder = require('../../components/embedder');
var upload = require('../../components/upload');

// Gets the embed.ly object
exports.embed = function(req, res) {
  embedder(req.params.url).then(function (embed) {
    res.json(embed);
  }).catch(function (err) {
    handleError(res, err);
  });
};

exports.uploadImage = function (req, res) {
  upload.image(req.files.file).then(function (url) {
    res.json({url: url});
  }).catch(function (err) {
    handleError(res, err);
  });
};

exports.uploadRawFile = function (req, res) {
    upload.file(req.files.file).then(function (url) {
        res.json({url: url});
    }).catch(function (err) {
        handleError(res, err);
    });
};


function handleError(res, err) {
  return res.send(500, err);
}