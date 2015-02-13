'use strict';

describe('Filter: https', function () {

  // load the filter's module
  beforeEach(module('roadAmicoApp'));

  // initialize a new instance of the filter before each test
  var https;
  beforeEach(inject(function ($filter) {
    https = $filter('https');
  }));

  it('should replace occurrances of http:// with https:// "', function () {
    var text = 'http://foo.bar/something';
    expect(https(text)).toBe('https://foo.bar/something');
  });

});
