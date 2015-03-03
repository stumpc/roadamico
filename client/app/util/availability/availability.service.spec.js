'use strict';

describe('Service: availability', function () {

  // load the service's module
  beforeEach(module('roadAmicoApp'));

  // instantiate service
  var Availability;
  beforeEach(inject(function (_Availability_) {
    Availability = _Availability_;
  }));

  it('should do something', function () {
    expect(!!Availability).toBe(true);
  });

});
