'use strict';

angular.module('roadAmicoApp')
  .controller('MessagesCtrl', function ($scope, $filter, Message, Auth, socket) {
    //var sent = Message.sent();
    //var received = Message.received();
    //sent.$promise.then(received.$promise.then(function () {
    //  socket.syncUpdates('message', $scope.received, function (message) {
    //    return message.to._id === userId;
    //  });
    //}));

    $scope.activeGroup = [];
    $scope.view = function (group) {
      $scope.activeGroup = group;

      group.filter($filter('unread')).forEach(function (message) {
        //console.log(message);
        message.read = true;
        Message.mark(message);
      });
    };

    $scope.user = Auth.getCurrentUser();

    // TODO: Make filters
    //$scope.getMessageName = function (message) {
    //  return message.to._id === $scope.user._id ? message.from.name : message.to.name;
    //};

    //$scope.countUnread = function (group) {
    //  return group.filter(function (message) {
    //    return message.to._id == $scope.user._id && !message.read;
    //  }).length;
    //};

    function process() {
      $scope.messageData = _(messages)
        .forEach(function (message) {                         // Add the moment property
          message.moment = moment(message.time);
        })
        .groupBy($filter('messageTarget'))
        //.groupBy(function (message) {                         // Group by user
        //  return message.to._id === $scope.user._id ? message.from._id : message.to._id;
        //})
        .mapValues(function (messageGroup) {                  // Sort within groups by date
          return _(messageGroup).sortBy('moment').value().reverse();
        })
        .sortBy(function (messageGroup) {                     // Sort groups by most recent
          return messageGroup[0].moment;
        })
        .value().reverse();
    }

    var messages = Message.mine();
    messages.$promise.then(function () {
      process();
      socket.syncUpdates('message', messages, process);
    });



  });
