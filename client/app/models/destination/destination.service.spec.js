'use strict';

describe('Service: destination', function () {

  // load the service's module
  beforeEach(module('roadAmicoApp'));

  // instantiate service
  var Destination;
  beforeEach(inject(function (_Destination_) {
    Destination = _Destination_;
  }));

  it('should do something', function () {
    expect(!!Destination).toBe(true);
  });

});
