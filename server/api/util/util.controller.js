'use strict';

var _ = require('lodash');
var embedder = require('../../components/embedder');

// Gets the embed.ly object
exports.embed = function(req, res) {
  embedder(req.params.url).then(function (embed) {
    res.json(embed);
  }).catch(function (err) {
    handleError(res, err);
  });
};


function handleError(res, err) {
  return res.send(500, err);
}
