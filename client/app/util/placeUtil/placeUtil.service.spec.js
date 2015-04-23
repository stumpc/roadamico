'use strict';

describe('Service: placeUtil', function () {

  // load the service's module
  beforeEach(module('roadAmicoApp'));

  // instantiate service
  var placeUtil;
  beforeEach(inject(function (_placeUtil_) {
    placeUtil = _placeUtil_;
  }));

  it('should get a thumbnail url from photos', function () {
    var place = {
      feed: [{
        photo: 'http://url.com/1'
      }]
    };
    var url = placeUtil.getPhoto(place);
    expect(url).toBe('http://url.com/1');
  });

  it('should get a thumbnail url from embeds', function () {
    var place = {
      feed: [{
        embed: [{thumbnail_url: 'http://url.com/2'}]
      }]
    };
    var url = placeUtil.getPhoto(place);
    expect(url).toBe('http://url.com/2');
  });

  it('should use a placeholder url when there is no photo', function () {
    var place = {
      feed: [{
        text: 'hello world'
      }]
    };
    var url = placeUtil.getPhoto(place);
    expect(url).toBe('/assets/images/place_placeholder.jpg');
  });

});
