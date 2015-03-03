'use strict';

describe('Controller: NewavailabilityCtrl', function () {

  // load the controller's module
  beforeEach(module('roadAmicoApp'));

  var NewavailabilityCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewavailabilityCtrl = $controller('NewavailabilityCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
