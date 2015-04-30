'use strict';

angular.module('roadAmicoApp')
  .controller('ViewListCtrl', function ($scope, $q, $upload, $modal, $location, $document, Auth, list, List, Place,
                                        placeUtil) {

    $document[0].title = 'RoadAmico - ' + list.name;

    $scope.list = list;
    $scope.user = Auth.getCurrentUser();

    $scope.canEdit = function (list) {
      return Auth.isLoggedIn() && ($scope.user.role === 'admin' || $scope.user.role === 'curator' || !list.curated);
    };

    $scope.editing = false;
    $scope.newEntry = {};

    // Following

    $scope.userFollowing = _.find($scope.user.following.lists, {list: list._id});

    $scope.follow = function () {
      $scope.user.$follow({target: 'list', tid: list._id}).then(function () {
        $scope.userFollowing = _.find($scope.user.following.lists, {list: list._id});
      });
    };

    $scope.unfollow = function () {
      $scope.user.$unfollow({target: 'list', tid: list._id}).then(function () {
        $scope.userFollowing = null;
      });
    };

    // Comment

    $scope.disqus = {
      id: 'list:' + list._id,
      url: $location.absUrl()
    };

    $scope.openComments = function () {
      var modalScope = $scope.$new();
      $modal.open({
        templateUrl: 'app/lists/view/commentModal.html',
        scope: modalScope
      });
    };

    // Editing

    function process() {
      _.forEach(list.entries, function (entry) {
        if (entry.place) {
          entry.place.rating = placeUtil.getRating(entry.place);
          entry.place.photo = placeUtil.getPhoto(entry.place);
        }
      });
    }
    process();

    $scope.save = function () {
      return list.$update().then(function () {
        process();
      });
    };

    $scope.selectedPlace = {};

    $scope.places = Place.query();
    $scope.places.$promise.then(function () {
      _.forEach($scope.places, function (place) {
        place.rating = placeUtil.getRating(place);
        place.photo = placeUtil.getPhoto(place);
      });
    });

    $scope.add = function () {
      var promise;
      if ($scope.newEntry.file) {
        var deferred = $q.defer();
        $upload.upload({
          url: '/api/utils/upload',
          file: $scope.newEntry.file
        }).success(function (data) {
          deferred.resolve(data.url);
        });
        promise = deferred.promise;
      } else {
        promise = $q.when();
      }

      promise.then(function (url) {
        list.entries.push({
          photo: url,
          text: $scope.newEntry.text,
          embed: $scope.newEntry.embed,
          place: $scope.newEntry.place && $scope.newEntry.place._id,
          datetime: moment().toISOString(),
          poster: $scope.user._id
        });
        $scope.newEntry = {};
        $scope.save();
      });
    };



    $scope.remove = function (index) {
      list.entries.splice(index, 1);
      $scope.save();
    };

    $scope.moveUp = function (index) {
      if (index === 0) return;
      var entry = list.entries.splice(index, 1)[0];
      list.entries.splice(index - 1, 0, entry);
      $scope.save();
    };

    $scope.moveDown = function (index) {
      if (index === list.entries.length - 1) return;
      var entry = list.entries.splice(index, 1)[0];
      list.entries.splice(index + 1, 0, entry);
      $scope.save();
    };

  });
