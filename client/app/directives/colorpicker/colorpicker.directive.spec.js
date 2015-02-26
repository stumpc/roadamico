'use strict';

describe('Directive: colorpicker', function () {

  // load the directive's module and view
  beforeEach(module('roadAmicoApp'));
  beforeEach(module('app/directives/colorpicker/colorpicker.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  //it('should make hidden element visible', inject(function ($compile) {
  //  element = angular.element('<colorpicker></colorpicker>');
  //  element = $compile(element)(scope);
  //  scope.$apply();
  //  expect(element.text()).toBe('this is the colorpicker directive');
  //}));
});
