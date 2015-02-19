'use strict';

describe('Service: geolocator', function () {

  // load the service's module
  beforeEach(module('roadAmicoApp'));

  // instantiate service
  var Geolocator;
  beforeEach(inject(function (_Geolocator_) {
    Geolocator = _Geolocator_;
  }));

  it('should do something', function () {
    expect(!!Geolocator).toBe(true);
  });

});
