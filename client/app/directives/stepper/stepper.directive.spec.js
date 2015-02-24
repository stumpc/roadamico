'use strict';

describe('Directive: stepper', function () {

  // load the directive's module
  beforeEach(module('roadAmicoApp'));

  var scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  //it('should make hidden element visible', inject(function ($compile) {
  //  element = angular.element('<stepper></stepper>');
  //  element = $compile(element)(scope);
  //  expect(element.text()).toBe('this is the stepper directive');
  //}));
});
