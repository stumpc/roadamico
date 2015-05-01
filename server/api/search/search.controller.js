'use strict';

var _ = require('lodash');
var Place = require('../place/place.model');
var List = require('../list/list.model');
var Event = require('../event/event.model');
var Snowball = require('snowball');

var stemmer = new Snowball('English');

// Stop words based on google stop words from: http://www.ranks.nl/stopwords
var stopWords = ['i', 'a', 'about', 'an', 'are', 'as', 'at', 'be', 'by', 'com', 'for', 'from', 'how', 'in', 'is', 'it', 'of', 'on', 'or', 'that', 'the', 'this', 'to', 'was', 'what', 'when', 'where', 'who', 'will', 'with', 'the', 'www'];

function prep(value) {
  value = value.toLowerCase();

  // Remove stop words
  stopWords.forEach(function (word) {
    value.replace(word, '');
  });

  // Remove punctuation and fix spaces
  value = value.replace(/\W/g, ' ').replace(/\s+/g, ' ').trim();

  // Stem words
  stemmer.setCurrent(value);
  stemmer.stem();
  return stemmer.getCurrent();
}


/**
 * Main search endpoint
 *
 * A search looks for text matches in
 *   Places:
 *     Name,
 *     Address,
 *     Description
 *     Post text
 *     Post title
 *     Post description
 *   Lists:
 *     Name
 *     Tags
 *     Entry text
 *     Entry title
 *     Entry description
 *     Place name
 *   Events:
 *     Name
 *
 * @param req
 * @param res
 */
exports.search = function(req, res) {

  var results = [];

  var query = prep(req.body.query);

  function check(value) {
    if (!value) { return; }
    value = prep(value);
    return value.indexOf(query) > -1
      || query.indexOf(value) > -1; // This makes the search more tolerant
  }


  // ---  Search Places  ---
  // --- --- --- --- --- ---
  Place.find({}, function (err, places) {
    if (err) { return handleError(res, err); }

    places.forEach(function (place) {
      place._doc.type = 'place';

      // Check place information
      if (check(place.locationDetails.name)
        || check(place.locationDetails.formatted_address)
        || check(place.description)) {
        return results.push(place);
      }

      // Check posts
      for (var i = 0; i < place.feed.length; i++) {
        var post = place.feed[i];
        if (check(post.text)
          || check(post.embed && post.embed.title)
          || check(post.embed && post.embed.description)) {
          return results.push(place);
        }
      }
    });


    // ---  Search Lists   ---
    // --- --- --- --- --- ---
    List.find({}).populate('entries.place', 'locationDetails').exec(function (err, lists) {
      if (err) { return handleError(res, err); }

      lists.forEach(function (list) {
        list._doc.type = 'list';

        // Check name and tags
        if (check(list.name)) {
          return results.push(list);
        }
        for (var i = 0; i < list.tags.length; i++) {
          if (check(list.tags[i])) {
            return results.push(list);
          }
        }

        // Check entries
        for (i = 0; i < list.entries.length; i++) {
          var entry = list.entries[i];
          if (check(entry.text)
            || check(entry.embed && entry.embed.title)
            || check(entry.embed && entry.embed.description)
            || check(entry.place && entry.place.locationDetails && entry.place.locationDetails.name)) {
            return results.push(list);
          }
        }
      });


      // ---  Search Events  ---
      // --- --- --- --- --- ---
      Event.find({}, function (err, events) {
        if (err) { return handleError(res, err); }

        events.forEach(function (event) {
          event._doc.type = 'event';

          if (check(event.name)) {
            results.push(event);
          }
        });


        // Return the results
        res.json({
          query: req.body.query,
          results: results
        });

      });
    });
  });
};



function handleError(res, err) {
  return res.send(500, err);
}
