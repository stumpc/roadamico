'use strict';

angular.module('roadAmicoApp')
  .controller('MessagesCtrl', function ($scope, $filter, Message, Auth, socket) {
    $scope.activeGroup = [];
    $scope.user = Auth.getCurrentUser();

    $scope.view = function (group) {
      $scope.activeGroup.active = false;
      $scope.activeGroup = group;
      $scope.activeGroup.active = true;

      group.filter($filter('unread')).forEach(function (message) {
        message.read = true;
        Message.mark(message);
      });
    };

    // Take the messages and group them by user and sort them
    function process() {
      $scope.messageData = _(messages)
        .forEach(function (message) {                         // Add the moment property
          message.moment = moment(message.time);
        })
        .groupBy($filter('messageTarget'))                    // Group by user
        .mapValues(function (messageGroup) {                  // Sort within groups by date
          return _(messageGroup).sortBy('moment').value().reverse();
        })
        .sortBy(function (messageGroup) {                     // Sort groups by most recent
          return messageGroup[0].moment;
        })
        .value().reverse();                                   // Most recent first

      // Update the active group
      if ($scope.activeGroup.length) {
        $scope.activeGroup = _.find($scope.messageData, function (group) {
          return $filter('messageTarget')(group[0]) === $filter('messageTarget')($scope.activeGroup[0]);
        });
      } else if ($scope.messageData.length) {
        $scope.activeGroup = $scope.messageData[0];
      }
      $scope.activeGroup.active = true;
    }

    var messages = Message.mine();
    messages.$promise.then(function () {
      process();
      socket.syncUpdates('message', messages, process);
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('message');
    });

    $scope.respond = function () {
      var message = {
        message: $scope.messageText,
        to: $filter('messageTarget')($scope.activeGroup[0])
      };
      Message.save(message);
      $scope.messageText = '';
    };

  });
