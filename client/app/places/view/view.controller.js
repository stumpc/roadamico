'use strict';

angular.module('roadAmicoApp')
  .controller('ViewPlaceCtrl', function ($scope, $q, $location, $document, $modal, $sce, Auth, $upload, place, Place, Event, Google, Geolocator) {
    $document[0].title = 'RoadAmico - ' + place.name;

    $scope.place = place;
    var allEvents = Event.list({id: place._id});
    allEvents.$promise.then(function (events) {
      $scope.events = _(events)
        .forEach(function (event) { // Add workable and displayable time data
          event.moment = moment(event.datetime);
          event.when = event.moment.format('llll');
        })
        .filter(function (event) { // Take out past events
          return event.moment >= moment();
        })
        .sortBy('moment').take(3).value(); // Only display the three closest events
    });

    $scope.user = Auth.getCurrentUser();
    console.log(place.locationDetails);

    // --- Following ---

    $scope.userFollowing = _.find($scope.user.followingPlaces, {place: place._id});

    $scope.follow = function () {
      $scope.user.$follow({target: 'place', tid: place._id}).then(function () {
        $scope.userFollowing = _.find($scope.user.followingPlaces, {place: place._id});
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

    function average (nums) {
      return Math.round(nums.reduce(function (a, b) { return a + b; }, 0) / nums.length);
    }

    $scope.rating = average(_.pluck(place.ratings, 'score'));

    $scope.rate = function (value) {
      console.log(value);
      Place.rate({id: place._id}, {score: value}).$promise.then(function (_place) {
        angular.copy(_place, place);
        $scope.rating = average(_.pluck(place.ratings, 'score'));
      });
    };

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



    // --- Feed ---

    // http://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
    var urlRegex = /[-a-zA-Z0-9@:%_\+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&/=]*)?/gi;
    $scope.newPost = {};
    $scope.addPost = function () {

      var results = $scope.newPost.text.match(urlRegex);
      if (results && results.length) {
        // For now only use the first URL
        $scope.newPost.url = results[0];
        $scope.newPost.text = $scope.newPost.text.replace(results[0], '').trim();
      }

      Place.addPost({id: place._id}, $scope.newPost).$promise.then(function (_place) {
        $scope.newPost = {};
        angular.copy(_place, place);
      });
    };

    $scope.addPhoto = function (image) {
      //$scope.attachedImage = image;
      $scope.attachedImage = image;


      //$upload.upload({
      //  url: '/api/places/' + place._id + '/feed',
      //  file: image
      //}).success(function (_place) {
      //  angular.copy(_place, place);
      //});
    };

  });
