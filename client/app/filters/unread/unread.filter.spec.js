'use strict';

describe('Filter: unread', function () {

  // load the filter's module
  beforeEach(module('roadAmicoApp'));

  // initialize a new instance of the filter before each test
  var unread;
  beforeEach(inject(function ($filter) {
    unread = $filter('unread');
  }));

  //it('should return the input prefixed with "unread filter:"', function () {
  //  var text = 'angularjs';
  //  expect(unread(text)).toBe('unread filter: ' + text);
  //});

});
