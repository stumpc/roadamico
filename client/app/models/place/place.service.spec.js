'use strict';

describe('Service: place', function () {

  // load the service's module
  beforeEach(module('roadAmicoApp'));

  // instantiate service
  var place;
  beforeEach(inject(function (_place_) {
    place = _place_;
  }));

  it('should do something', function () {
    expect(!!place).toBe(true);
  });

});
