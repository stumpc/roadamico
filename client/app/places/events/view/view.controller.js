'use strict';

angular.module('roadAmicoApp')
  .controller('EventViewCtrl', function ($scope, $state, place, event, Event, Auth, Modal) {
    $scope.place = place;
    $scope.user = Auth.getCurrentUser();
    $scope.isLoggedIn = Auth.isLoggedIn;


    // Can edit if admin, creator, or leader of restriction group
    $scope.canEdit = function () {
      var a = $scope.user.role === 'admin' || $scope.user.role === 'curator';
      var b = event.creator === $scope.user._id;
      var c = !!_.find(event.groupRestriction, function (group) {
        return group.administrator === $scope.user._id;
      });
      return a || b || c;
    };



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
        event.moment = moment(event.datetime);
        event.when = event.moment.format('llll');
        event.userGoing = true;
      });
    };

    $scope.unjoin = Modal.confirm.yesno(function () {
      event.$unjoin().then(function () {
        event.moment = moment(event.datetime);
        event.when = event.moment.format('llll');
        event.userGoing = false;
      });
    });

    // Messaging

    $scope.newMessage = {};
    $scope.sendMessage = function () {
      Event.message({id: event._id}, $scope.newMessage).$promise.then(function (updated) {
        _.merge(event, updated);
        $scope.newMessage = {};
      });
    };
  });
