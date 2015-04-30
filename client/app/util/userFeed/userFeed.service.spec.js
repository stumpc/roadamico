'use strict';

describe('Service: userFeed', function () {

  // load the service's module
  beforeEach(module('roadAmicoApp'));

  // instantiate service
  var userFeed;
  beforeEach(inject(function (_userFeed_) {
    userFeed = _userFeed_;
  }));

  it('should do something', function () {
    expect(!!userFeed).toBe(true);
  });

});
