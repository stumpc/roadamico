'use strict';

var should = require('should');
var tproc = require('./textProcessor');

describe('Text processor', function() {

  it('should remove multiple adjacent letters', function () {
    var str1 = tproc.unique('one');
    var str2 = tproc.unique('onne');
    var str3 = tproc.unique('onne  two');
    str1.should.equal('one');
    str2.should.equal('one');
    str3.should.equal('one two');
  });

  it('should remove spaces', function () {
    var str1 = tproc.removeSpaces('one');
    var str2 = tproc.removeSpaces('one two');
    var str3 = tproc.removeSpaces('  one\ttwo');
    str1.should.equal('one');
    str2.should.equal('onetwo');
    str3.should.equal('onetwo');
  });

  it('should unify vowels', function () {
    var str1 = tproc.unifyVowels('qwerty');
    var str2 = tproc.unifyVowels('roadamico');
    var str3 = tproc.unifyVowels('aåáàâäãeéèêëiíìîïoóòôöõuúùûüyÿ');
    str1.should.equal('qwarta');
    str2.should.equal('raadamaca');
    str3.should.equal('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  });

  it('should remove vowels', function () {
    var str1 = tproc.removeVowels('qwrt');
    var str2 = tproc.removeVowels('0a1e2i3o4u5y6');
    var str3 = tproc.removeVowels('mmaåáàâäãeéèêëiíìîïoóòôöõuúùûüyÿnn');
    str1.should.equal('qwrt');
    str2.should.equal('0123456');
    str3.should.equal('mmnn');
  });
});
