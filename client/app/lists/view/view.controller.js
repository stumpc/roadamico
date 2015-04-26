'use strict';

angular.module('roadAmicoApp')
  .controller('ViewListCtrl', function ($scope, $q, $upload, Auth, list, List, placeUtil) {
    $scope.list = list;
    $scope.user = Auth.getCurrentUser();

    $scope.canEdit = function (list) {
      return Auth.isLoggedIn(); // TODO: Change this once permissions are implemented
    };

    $scope.editing = false;
    $scope.newEntry = {};

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
          place: $scope.newEntry.place
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
