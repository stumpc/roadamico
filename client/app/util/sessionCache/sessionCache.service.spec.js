'use strict';

describe('Service: sessionCache', function () {

  // load the service's module
  beforeEach(module('roadAmicoApp'));

  // instantiate service
  var sessionCache;
  beforeEach(inject(function (_sessionCache_) {
    sessionCache = _sessionCache_;
  }));

  it('should do something', function () {
    expect(!!sessionCache).toBe(true);
  });

});
