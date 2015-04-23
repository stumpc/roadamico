'use strict';

angular.module('roadAmicoApp')
  .controller('ViewListCtrl', function ($scope, list, placeUtil) {
    $scope.list = list;

    $scope.canEdit = function (list) {
      return true; // TODO: Change this once permissions are implemented
    };

    $scope.editing = false;

    function process() {
      _.forEach(list.entries, function (entry) {
        if (entry.place) {
          entry.place.rating = placeUtil.getRating(entry.place);
          entry.place.photo = placeUtil.getPhoto(entry.place);
        }
      });
    }
    process();

    $scope.remove = function (index) {
      list.entries.splice(index, 1);
    };

    $scope.moveUp = function (index) {
      if (index === 0) return;
      var entry = list.entries.splice(index, 1)[0];
      list.entries.splice(index - 1, 0, entry);
    };

    $scope.moveDown = function (index) {
      if (index === list.entries.length - 1) return;
      var entry = list.entries.splice(index, 1)[0];
      list.entries.splice(index + 1, 0, entry);
    };

    $scope.save = function () {
      list.$update().then(function () {
        process();
        $scope.editing = false;
      });
    };
  });
