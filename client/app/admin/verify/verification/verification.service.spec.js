'use strict';

describe('Service: Verification', function () {

  // load the service's module
  beforeEach(module('roadAmicoApp'));

  // instantiate service
  var Verification;
  beforeEach(inject(function (_Verification_) {
    Verification = _Verification_;
  }));

  it('should do something', function () {
    expect(!!Verification).toBe(true);
  });

});
