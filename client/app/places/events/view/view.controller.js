'use strict';

angular.module('roadAmicoApp')
  .controller('EventViewCtrl', function ($scope, $state, place, event, Event, Auth, Modal) {
    $scope.place = place;
    $scope.user = Auth.getCurrentUser();
    $scope.isLoggedIn = Auth.isLoggedIn;

    // Event
    $scope.event = event;
    event.moment = moment(event.datetime);
    event.when = event.moment.format('llll');
    event.userGoing = _(event.participants).map('participant').map('_id').contains($scope.user._id);

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

    // Messaging

    $scope.newMessage = {};
    $scope.sendMessage = function () {
      Event.message({id: event._id}, $scope.newMessage).$promise.then(function (updated) {
        _.merge(event, updated);
        $scope.newMessage = {};
      });
    };
  });
