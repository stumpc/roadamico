'use strict';

describe('Directive: mediaSelector', function () {

  // load the directive's module and view
  beforeEach(module('roadAmicoApp'));
  beforeEach(module('app/directives/mediaSelector/mediaSelector.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<media-selector></media-selector>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the mediaSelector directive');
  }));
});