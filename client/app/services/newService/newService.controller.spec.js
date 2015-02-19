'use strict';

describe('Controller: NewserviceCtrl', function () {

  // load the controller's module
  beforeEach(module('roadAmicoApp'));

  var NewserviceCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewserviceCtrl = $controller('NewserviceCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
