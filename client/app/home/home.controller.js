'use strict';

angular.module('roadAmicoApp')
  .controller('HomeCtrl', function ($scope, $resource, Auth, Service, Availability, Modal) {
    $scope.message = 'Hello';

    $scope.user = Auth.getCurrentUser();

    $scope.user.$promise.then(function () {
      $scope.services = Service.listByProvider({id: $scope.user._id});
    });

    $scope.feed = $resource('/api/feed').query();

    // TODO: Only show upcoming bookings
    Availability.mine().$promise.then(function (bookings) {
      var now = moment();
      $scope.upcomingBookings = _.filter(bookings, function (booking) {
        return moment(booking.datetime) >= now && // Hasn't happened yet
          !_.find(booking.booking.updates, {status: 'canceled'});
      });
      $scope.pastBookings = _.filter(bookings, function (booking) {
        return moment(booking.datetime) < now && // Hasn't happened yet
          !_.find(booking.booking.updates, {status: 'canceled'});
      });
      $scope.canceledBookings = _.filter(bookings, function (booking) {
        return _.find(booking.booking.updates, {status: 'canceled'});
      });
    });

    $scope.cancel = Modal.confirm.yesno(function (booking) {
      //console.log(booking);
      booking.$cancel(function () {
        alert('canceled');
      });
    });

  });
