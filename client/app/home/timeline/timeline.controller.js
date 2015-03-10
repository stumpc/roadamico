'use strict';

angular.module('roadAmicoApp')
  .controller('TimelineCtrl', function ($scope, Availability) {
    $scope.message = 'Hello';


    Availability.mine().$promise.then(function (bookings) {
      var now = moment();
      $scope.monthData = _(bookings)
        .forEach(function (booking) {
          booking.moment = moment(booking.datetime);
          booking.canceled = !!_.find(booking.booking.updates, {status: 'canceled'});
          booking.canRate = !_.find(booking.booking.updates, {status: 'rated'}) && !booking.canceled && booking.moment < moment();
        })
        .filter(function (booking) {
          return moment(booking.datetime) < now ||    // Has already happened
            booking.canceled;                         // Or Canceled
        })
        .groupBy(function (booking) {
          return booking.moment.format('MMM YYYY');
        })
        .mapValues(function (data) {
          return _.sortBy(data, 'moment').reverse();
        })
        .value();

      $scope.months = _.keys($scope.monthData);

        //.sortBy('moment')
    });
  });
