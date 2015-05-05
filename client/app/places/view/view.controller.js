'use strict';

angular.module('roadAmicoApp')
  .controller('ViewPlaceCtrl', function ($scope, $q, $location, $document, $modal, $sce, Auth, $upload, place, Place,
                                         Event, Google, Geolocator, placeUtil, Modal) {
    $document[0].title = 'RoadAmico - ' + place.locationDetails.name;

    $scope.place = place;
    $scope.user = Auth.getCurrentUser();
    $scope.isLoggedIn = Auth.isLoggedIn;
    //console.log(place.locationDetails);

    // --- Following ---

    $scope.userFollowing = _.find($scope.user.following && $scope.user.following.places, {place: place._id});

    $scope.follow = function () {
      $scope.user.$follow({target: 'place', tid: place._id}).then(function () {
        $scope.userFollowing = _.find($scope.user.following && $scope.user.following.places, {place: place._id});
      });
    };

    $scope.unfollow = function () {
      $scope.user.$unfollow({target: 'place', tid: place._id}).then(function () {
        $scope.userFollowing = null;
      });
    };



    // --- Rating and comments ---

    // Info for disqus comments
    $scope.disqus = {
      id: 'place:' + place._id,
      url: $location.absUrl()
    };

    $scope.rating = placeUtil.getRating(place);

    $scope.rate = function (value) {
      console.log(value);
      Place.rate({id: place._id}, {score: value}).$promise.then(function (_place) {
        angular.copy(_place, place);
        $scope.rating = placeUtil.getRating(place);
      });
    };

    // Opens the rating and comment modal
    $scope.viewRatings = function () {
      var modalScope = $scope.$new();
      modalScope.hover = function(value) {
        modalScope.message = ['Terrible', 'Mediocre', 'Ok', 'Enjoyable', 'Excellent'][value-1];
      };
      modalScope.userRating = _.find(place.ratings, function (rating) {
        return rating.poster === $scope.user._id;
      });
      modalScope.userRating = modalScope.userRating && modalScope.userRating.score;

      $modal.open({
        templateUrl: 'app/places/view/ratingModal.html',
        scope: modalScope
      });
    };



    // --- Setting the map location ---

    // Map async loader
    var mapLoader = (function () {
      var deferred = $q.defer();
      $scope.$on('mapInitialized', function(event, map) {
        deferred.resolve(map);
      });
      return deferred.promise;
    }());

    // Set the map center and marker
    Geolocator(place).then(function (pos) {
      mapLoader.then(function (map) {
        map.setCenter(pos);
        new Google.maps.Marker({
          position: pos,
          map: map,
          title: place.location
        });
      });
    });


    // --- Events ---

    var allEvents = Event.list({id: place._id});
    allEvents.$promise.then(function (events) {
      $scope.allEvents = _(events)
        .forEach(function (event) { // Add workable and displayable time data
          event.moment = moment(event.datetime);
          event.when = event.moment.format('llll');
          event.userGoing = _.contains(_.pluck(event.participants, 'participant'), $scope.user._id);
        })
        .filter(function (event) { // Take out past events
          return event.moment >= moment();
        })
        .filter(function (event) { // Take out canceled events
          return !event.canceled;
        })
        .sortBy('moment').value(); // Sort by closest
      $scope.events = _.take($scope.allEvents, 3);  // We will only display three
    });

    $scope.joinEvent = function (event) {
      event.$join().then(function () {
        console.log('Joined!');
        event.moment = moment(event.datetime);
        event.when = event.moment.format('llll');
        event.userGoing = true;
      });
    };



    // --- Feed ---

    _.forEach(place.feed, function (post) {
      post.canDelete = $scope.user._id === post.poster || $scope.user.role === 'admin';
      post.remove = function () {
        Modal.confirm.delete(function () {
          var index = _.findIndex(place.feed, post);
          Place.removePost({id: place._id, index: index}).$promise.then(function (_place) {
            angular.copy(_place, place);
          });
          //place.feed.splice(index, 1);
        })('this post', null);
      };
    });

    $scope.newPost = {};

    $scope.addEntry = function () {
      var promise;
      if ($scope.newPost.file) {
        var deferred = $q.defer();
        $upload.upload({
          url: '/api/utils/upload',
          file: $scope.newPost.file
        }).success(function (data) {
          deferred.resolve(data.url);
        });
        promise = deferred.promise;
      } else {
        promise = $q.when();
      }

      promise.then(function (url) {
        var post = {
          photo: url,
          text: $scope.newPost.text,
          embed: $scope.newPost.embed,
          place: $scope.newPost.place
        };
        Place.addEntry({id: place._id}, post).$promise.then(function (_place) {
          $scope.newPost = {};
          angular.copy(_place, place);
        });
      });
    };


  });
