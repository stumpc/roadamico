'use strict';

describe('Controller: CreateCtrl', function () {

  // load the controller's module
  beforeEach(module('roadAmicoApp'));

  var CreateCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CreateCtrl = $controller('CreateGroupCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
