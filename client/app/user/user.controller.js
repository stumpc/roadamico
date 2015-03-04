'use strict';

angular.module('roadAmicoApp')
  .controller('UserCtrl', function ($scope, $stateParams, $state, $q, User, Google, Geolocator, Service, Auth, MessageModal, languages) {

    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.authUser = Auth.getCurrentUser();

    $scope.languages = languages;
    $scope.user = User.get({id: $stateParams.userId});
    $scope.joined = $scope.user.joined || moment('2015-02-14T05:00:00.000Z').toISOString();
    $scope.message = MessageModal;

    $scope.isFollowing = function () {
      return $scope.authUser.following && !!_.find($scope.authUser.following, function (f) {
          return f.provider === $scope.user._id;
        });
    };

    $scope.follow = function (id, add) {
      var method = add ? 'follow' : 'unfollow';
      User[method]({id: id}).$promise.then(function (user) {
        // Make sure we update the original user object
        $scope.authUser.following = user.following;
      });
    };



    // Leave this page if given an invalid user ID
    $scope.user.$promise.then(function () {
      $scope.services = Service.listByProvider({ id: $scope.user._id });
    }).catch(function () {
      $state.go('home');
    });



    $scope.map = {
      //center: [0,0]
    };

    // Map async loader
    var mapLoader = (function () {
      var deferred = $q.defer();
      $scope.$on('mapInitialized', function(event, map) {
        deferred.resolve(map);
      });
      return deferred.promise;
    }());

    // Set the map center and marker
    $scope.user.$promise.then(Geolocator).then(function (pos) {
      mapLoader.then(function (map) {
        map.setCenter(pos);
        new Google.maps.Marker({
          position: pos,
          map: map,
          title: $scope.user.location
        });
      });
    });
  });
