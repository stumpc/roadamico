'use strict';

describe('Controller: UpcomingCtrl', function () {

  // load the controller's module
  beforeEach(module('roadAmicoApp'));

  var UpcomingCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UpcomingCtrl = $controller('UpcomingCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
