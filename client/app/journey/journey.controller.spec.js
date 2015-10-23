'use strict';

describe('Controller: JourneyCtrl', function () {

  // load the controller's module
  beforeEach(module('roadAmicoApp'));

  var JourneyCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    JourneyCtrl = $controller('JourneyCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
  });
});
