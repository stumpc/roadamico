'use strict';

describe('Controller: CuratorsCtrl', function () {

  // load the controller's module
  beforeEach(module('roadAmicoApp'));

  var CuratorsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CuratorsCtrl = $controller('CuratorsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
