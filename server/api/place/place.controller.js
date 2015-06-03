'use strict';

var _ = require('lodash');
var auth = require('../../auth/auth.service');
var Place = require('./place.model');
var User = require('../user/user.model');
var List = require('../list/list.model');
var moment = require('moment');
var upload = require('../../components/upload');
var Q = require('q');
var jwt = require('jsonwebtoken');
var config = require('../../config/environment');
var mongoose = require('mongoose');

// Get list of places
exports.index = function(req, res) {
  //Place.find(function (err, places) {
  Place.find({}).sort({ "locationDetails.name": 'asc' }).exec(function (err, places) {
      var itemsLeft = places.length;
      var place_list = [];
      var role = "", user_id;


      var promise;
      if(req.headers.authorization){
          var deferred = Q.defer();
          var parts = req.headers.authorization.split(' ');
          if (parts.length == 2) {
              var credentials = parts[1];
              jwt.verify(credentials, config.secrets.session, {}, function(err, decoded) {
                  user_id = decoded._id;
                  User.findById(mongoose.Types.ObjectId(user_id), function(err, _user) {
                      if(err){
                          res.send(403);
                      }
                      role = _user.role;
                      deferred.resolve();
                  })
              });
          }
          promise = deferred.promise;
      }
      else {
          promise =  Q.when();
      }

      promise.then(function(){
          places.forEach(function(place) {
              List.find({ "entries.place": place._id }, function(err, lists){
                  if(err) { return handleError(res, err); }
                  var aplace = {};
                  aplace._id = place._id;
                  aplace.description = place.description;
                  aplace.feed = place.feed;
                  aplace.ratings = place.ratings;
                  aplace.location = place.location;
                  aplace.locationDetails = place.locationDetails;
                  aplace.list = lists;

                  if(role == "admin" || (lists.length == 1 && lists[0].owners.indexOf(user_id) > -1)){
                      aplace.canDelete = true;
                  }
                  else {
                      aplace.canDelete = false;
                  }

                  place_list.push(aplace);

                  if(!--itemsLeft){
                      return res.json(200, place_list);
                  }
              });
          });
      });
  });
};


// Get a single place
exports.show = function(req, res) {
  var role = "", user_id;
  Place.findById(req.params.id, function (err, place) {
        if(err) { return handleError(res, err); }
        if(!place) { return res.send(404); }
          var promise;
          if(req.headers.authorization){
              var deferred = Q.defer();
              var parts = req.headers.authorization.split(' ');
              if (parts.length == 2) {
                  var credentials = parts[1];
                  jwt.verify(credentials, config.secrets.session, {}, function(err, decoded) {
                      user_id = decoded._id;
                      User.findById(mongoose.Types.ObjectId(user_id), function(err, _user) {
                          if(err){
                              res.send(403);
                          }
                          role = _user.role;
                          deferred.resolve();
                      })
                  });
              }
              promise = deferred.promise;
          }
          else {
              promise =  Q.when();
          }
          promise.then(function(){
              List.find({ "entries.place": place._id }, function(err, lists){
                  if(err) { return handleError(res, err); }
                  var aplace = {};
                  aplace._id = place._id;
                  aplace.description = place.description;
                  aplace.feed = place.feed;
                  aplace.ratings = place.ratings;
                  aplace.location = place.location;
                  aplace.locationDetails = place.locationDetails;
                  aplace.list = lists;

                  if(role == "admin" || (lists.length == 1 && lists[0].owners.indexOf(user_id) > -1)){
                      aplace.canDelete = true;
                  }
                  else {
                      aplace.canDelete = false;
                  }
                  return res.json(200, aplace);
              });
        });

  });
};

// Creates a new place in the DB.
exports.create = function(req, res) {
  Place.create(req.body, function(err, place) {
    if(err) { return handleError(res, err); }
    return res.json(201, place);
  });
};

// Updates an existing place in the DB.
exports.update = function(req, res) {
  delete req.body._id;
  delete req.body.photos;
  delete req.body.feed;
  delete req.body.ratings;
  delete req.body.promoted;

  Place.findById(req.params.id, function (err, place) {
    if (err) { return handleError(res, err); }
    if(!place) { return res.send(404); }
    var updated = _.merge(place, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, place);
    });
  });
};


exports.addEntry = function (req, res) {
  Place.findById(req.params.id, function (err, place) {
    if (err) { return handleError(res, err); }
    if(!place) { return res.send(404); }

    req.body.datetime = moment().toISOString();
    req.body.poster = req.user._id;
    place.feed.push(req.body);
    place.save(function (err, place) {
      if (err) return next(err);
      res.send(place);
    });
  });
};

exports.saveEntryPhoto = function(req, res){
    Place.findById(req.params.id, function (err, place) {
        if (err) { return handleError(res, err); }
        if(!place) { return res.send(404); }

        if(place.feed.length == 0){
            req.body.datetime = moment().toISOString();
            req.body.poster = req.user._id;
            place.feed.push(req.body);
            place.save(function (err, place) {
                if (err) return next(err);
                res.send(place);
            });
        }
        else {
            place.feed.forEach(function(feed_item){
                feed_item.photo = req.body.photo;
            });
            place.save(function (err, place) {
                if (err) return next(err);
                res.send(place);
            });
        }

    });
};

exports.removePost = function (req, res) {
  Place.findById(req.params.id, function (err, place) {
    if (err) { return handleError(res, err); }
    if(!place) { return res.send(404); }

    var post = place.feed[req.params.index];
    if (!post.poster.equals(req.user._id) && req.user.role !== 'admin') return res.send(403);

    place.feed.splice(req.params.index, 1);
    place.save(function (err, place) {
      if (err) return next(err);
      res.send(place);
    });
  });
};

// Deletes a place from the DB.
exports.destroy = function(req, res) {
    var parts = req.headers.authorization.split(' ');
    if (parts.length == 2) {
        var credentials = parts[1];
        jwt.verify(credentials, config.secrets.session, {}, function(err, decoded) {
            User.findById(mongoose.Types.ObjectId(decoded._id), function(err, _user) {
                if(err){
                    res.send(403);
                }

                if(_user.role == 'admin') {
                    Place.findById(req.params.id, function (err, place) {
                        if(err) { return handleError(res, err); }
                        if(!place) { return res.send(404); }
                        place.remove(function(err) {
                            if(err) {
                                return handleError(res, err);
                            }
                            return res.send(204);
                        });
                    });
                }
                else {
                    List.find({"entries.place" : req.params.id}, function(err, lists){
                        if(err) { return handleError(res, err); }
                        if(!lists){ return res.send(404); }
                        if(lists.length == 1) {
                            var owners = [];
                            //console.log(lists[0].owners.indexOf(decoded._id));
                            if(lists[0].owners.indexOf(decoded._id) > -1){
                                Place.findById(req.params.id, function (err, place) {
                                    if(err) { return handleError(res, err); }
                                    if(!place) { return res.send(404); }
                                    place.remove(function(err) {
                                        if(err) { return handleError(res, err); }
                                        return res.send(204);
                                    });
                                });
                            }

                        }
                        else{
                            return res.send(403);
                        }

                    });
                }
            });

        });
    }
    else {
        res.send(403);
    }
};

exports.rate = function (req, res) {
  Place.findById(req.params.id, function (err, place) {
    if(err) { return handleError(res, err); }
    if(!place) { return res.send(404); }

    // See if this user has already rated
    var rating = _.find(place.ratings, function (rating) {
      return req.user._id.equals(rating.poster);
    });
    if (rating) {
      rating.datetime = moment().toISOString();
      rating.score = req.body.score;
    } else {
      place.ratings.push({
        datetime: moment().toISOString(),
        poster: req.user._id,
        score: req.body.score
      });
    }
    console.log(JSON.stringify(place.ratings));
    place.save(function(err, place) {
      if(err) { return handleError(res, err); }
      return res.send(200, place);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
