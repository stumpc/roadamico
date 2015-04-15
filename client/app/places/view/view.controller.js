'use strict';

angular.module('roadAmicoApp')
  .controller('ViewPlaceCtrl', function ($scope, $q, $window, $location, $document, $modal, Auth, place, Place, Modal, Google, Geolocator) {
    $document[0].title = 'RoadAmico - ' + place.name;

    $scope.place = place;
    window.place = place;

    $scope.user = Auth.getCurrentUser();

    $scope.viewPhoto = function (photo) {
      Modal.info.image('', photo.url, '');
    };



    // --- Code related to rating and comments ---

    // Info for disqus comments
    $scope.disqus = {
      id: 'place:' + place._id,
      url: $location.absUrl()
    };

    function average (nums) {
      return Math.round(nums.reduce(function (a, b) { return a + b; }) / nums.length);
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




    // --- Code for loading the map location ---

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


  });
