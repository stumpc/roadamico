'use strict';

var should = require('should');
var curves = require('./curves');

describe('Weighting curves', function() {

  it('should weight evenly with a linear curve', function () {
    var w1 = curves.linear(0);
    var w2 = curves.linear(0.3);
    var w3 = curves.linear(0.6);
    var w4 = curves.linear(1);
    w1.should.equal(0);
    w2.should.equal(0.3);
    w3.should.equal(0.6);
    w4.should.equal(1);
  });

  it('should cutoff fast with a parabolic curve', function () {
    var w1 = curves.parabolic(0);
    var w2 = curves.parabolic(0.3);
    var w3 = curves.parabolic(0.6);
    var w4 = curves.parabolic(1);
    w1.should.equal(0);
    w2.should.be.below(0.3);
    w3.should.be.below(0.6);
    w4.should.equal(1);
  });

  it('should cutoff slow with an inverse parabolic curve', function () {
    var w1 = curves.inverse(0);
    var w2 = curves.inverse(0.3);
    var w3 = curves.inverse(0.6);
    var w4 = curves.inverse(1);
    w1.should.equal(0);
    w2.should.be.above(0.3);
    w3.should.be.above(0.6);
    w4.should.equal(1);
  });
});
