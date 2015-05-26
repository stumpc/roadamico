'use strict';

describe('Directive: photoUploader', function () {

    // load the directive's module and view
    beforeEach(module('roadAmicoApp'));
    beforeEach(module('app/directives/photoUploader/photoUploader.html'));

    var element, scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    //it('should make hidden element visible', inject(function ($compile) {
    //  element = angular.element('<media-selector></media-selector>');
    //  element = $compile(element)(scope);
    //  scope.$apply();
    //  expect(element.text()).toBe('this is the photoUploader directive');
    //}));
});
