'use strict';

describe('Directive: iconpicker', function () {

  // load the directive's module and view
  beforeEach(module('roadAmicoApp'));
  beforeEach(module('app/directives/iconpicker/iconpicker.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  //it('should make hidden element visible', inject(function ($compile) {
  //  element = angular.element('<iconpicker></iconpicker>');
  //  element = $compile(element)(scope);
  //  scope.$apply();
  //  expect(element.text()).toBe('this is the iconpicker directive');
  //}));
});
