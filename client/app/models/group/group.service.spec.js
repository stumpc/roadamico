'use strict';

describe('Service: group', function () {

  // load the service's module
  beforeEach(module('roadAmicoApp'));

  // instantiate service
  var Group;
  beforeEach(inject(function (_Group_) {
    Group = _Group_;
  }));

  it('should do something', function () {
    expect(!!Group).toBe(true);
  });

});
