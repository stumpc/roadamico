'use strict';

describe('Directive: embeddedMedia', function () {

  // load the directive's module and view
  beforeEach(module('roadAmicoApp'));
  beforeEach(module('app/directives/embeddedMedia/embeddedMedia.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<embedded-media></embedded-media>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the embeddedMedia directive');
  }));
});