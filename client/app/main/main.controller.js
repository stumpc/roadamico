'use strict';

angular.module('roadAmicoApp')
  .controller('MainCtrl', function ($scope, $http, $state, config, socket) {

    if (!config.appLive) {
      $state.go('landing');
    }

    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });



    ///  Datepicker

    //$scope.dt = new Date();


    $scope.openCalendar = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.dateFormat = 'MMMM dd, yyyy';

    // Categories

    $scope.activities = [
      'a tennis match',
      'a golf partner',
      'an open piano'
    ]

  });
