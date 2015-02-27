'use strict';

var should = require('should');
var gcdist = require('./greatCircleDist');

describe('Great circle distance', function() {

  var lat_lng = [
    [35.906875, -79.055729],
    [35.908822, -79.027920],
    [35.907432, -78.938484],
    [35.924193, -78.665543],
    [36.022863, -77.626648]
  ];

  it('should compute distances properly', function () {
    var dist0 = gcdist(lat_lng[0][0], lat_lng[0][1], lat_lng[0][0], lat_lng[0][1]);
    var dist1 = gcdist(lat_lng[0][0], lat_lng[0][1], lat_lng[1][0], lat_lng[1][1]);
    var dist2 = gcdist(lat_lng[0][0], lat_lng[0][1], lat_lng[2][0], lat_lng[2][1]);
    var dist3 = gcdist(lat_lng[0][0], lat_lng[0][1], lat_lng[3][0], lat_lng[3][1]);
    var dist4 = gcdist(lat_lng[0][0], lat_lng[0][1], lat_lng[4][0], lat_lng[4][1]);

    dist0.should.equal(0);
    dist1.should.be.above(dist0);
    dist2.should.be.above(dist1);
    dist3.should.be.above(dist2);
    dist4.should.be.above(dist3);
    dist4.should.be.above(50);
  });
});
