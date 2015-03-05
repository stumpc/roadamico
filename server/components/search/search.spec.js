'use strict';

var should = require('should');
var Search = require('./search');

describe('Search scoring', function() {

  var lat_lng = [
    [35.906875, -79.055729],
    [35.908822, -79.027920],
    [35.907432, -78.938484],
    [35.924193, -78.665543],
    [36.022863, -77.626648]
  ];

  it('should score distances with a cutoff', function () {
    var search = new Search();
    var dist0 = search.scoreDist(lat_lng[0], lat_lng[0]);
    var dist1 = search.scoreDist(lat_lng[0], lat_lng[1]);
    var dist2 = search.scoreDist(lat_lng[0], lat_lng[2]);
    var dist3 = search.scoreDist(lat_lng[0], lat_lng[3]);
    var dist4 = search.scoreDist(lat_lng[0], lat_lng[4]);

    dist0.should.equal(100);
    dist1.should.be.below(dist0);
    dist2.should.be.below(dist1);
    dist3.should.be.below(dist2);
    dist4.should.be.below(dist3);
    dist4.should.equal(0);
  });

  var cutoff = 25;

  it('should score similar text highly (> ' + cutoff + ')', function () {
    var search = new Search();
    var s1 = search.scoreText('book', 'back');
    var s2 = search.scoreText('thingy one', 'thing two');
    var s3 = search.scoreText('volleyball', 'basketball');
    var s4 = search.scoreText('superman', 'superwoman');
    //console.log('high', s1, s2, s3, s4);
    s1.should.be.above(cutoff);
    s2.should.be.above(cutoff);
    s3.should.be.above(cutoff);
    s4.should.be.above(cutoff);
  });

  it('should score dissimilar text lowly (< ' + cutoff + ')', function () {
    var search = new Search();
    var s1 = search.scoreText('milkshake', 'french fries');
    var s2 = search.scoreText('yoga', 'pilates');
    var s3 = search.scoreText('north carolina', 'mississippi');
    //console.log('low', s1, s2, s3);
    s1.should.be.below(cutoff);
    s2.should.be.below(cutoff);
    s3.should.be.below(cutoff);
  });

});
