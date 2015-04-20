'use strict';

angular.module('roadAmicoApp')
  .controller('EventViewCtrl', function ($scope, $state, place, event, Auth, Modal) {
    $scope.place = place;
    $scope.event = event;
    event.moment = moment(event.datetime);
    event.when = event.moment.format('llll');

    $scope.user = Auth.getCurrentUser();
    $scope.isLoggedIn = Auth.isLoggedIn;

    $scope.cancel = Modal.confirm.yesno(function () {
      event.$cancel().then(function () {
        console.log('Event canceled');
        $state.go('^.^.view');
      });
    });

    $scope.join = function () {
      event.$join().then(function () {
        console.log('Joined!');
        event.moment = moment(event.datetime);
        event.when = event.moment.format('llll');
        event.userGoing = true;
      });
    };
  });
