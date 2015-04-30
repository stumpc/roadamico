'use strict';

angular.module('roadAmicoApp')
  .factory('userFeed', function ($http, $q, Auth, placeUtil) {

    return function() {
      var deferred = $q.defer();

      Auth.getCurrentUser().$promise.then(function () {
        $http.get('/api/users/feed').success(function (feed) {
          //console.log(feed);

          // Get all the posts from the place feeds
          var placePosts = _(feed.places)
            .forEach(function (place) {
              _.forEach(place.feed, function (post) {
                post.moment = moment(post.datetime);
                post.place = place;
                post.type = 'post';
              });
            })
            .map('feed')
            .flatten()
            .value();

          // Get all the events
          var events = _.forEach(feed.events, function (event) {
            event.moment = moment(event.created);
            event.when = moment(event.datetime).format('llll');
            event.type = 'event';
          });

          // Get all the list entries
          var listEntries = _(feed.lists)
            .forEach(function (list) {
              _.forEach(list.entries, function (entry) {
                entry.moment = moment(entry.datetime);
                entry.list = list;
                entry.type = 'entry';
                if (entry.place) {
                  entry.place.rating = placeUtil.getRating(entry.place);
                  entry.place.photo = placeUtil.getPhoto(entry.place);
                }
              });
            })
            .map('entries')
            .flatten()
            .value();

          // Combine everything and sort by time
          var combined = [];
          combined.push.apply(combined, placePosts);
          combined.push.apply(combined, events);
          combined.push.apply(combined, listEntries);
          combined = _(combined)
            .sortBy('moment')
            .forEach(function (item) {
              item.timeDisp = item.moment.fromNow();
            })
            .value()
            .reverse();

          deferred.resolve(combined);
        });
      });

      return deferred.promise;
    };
  });
