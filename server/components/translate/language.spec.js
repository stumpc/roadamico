'use strict';

var should = require('should');
var language = require('./language');

describe('Language service', function () {

  it('should detect a users language', function () {
    var user = {
      languages: ['fr']
    };
    var lang = language.getUserLocale(user);
    lang.code.should.equal('fr');
  });

  it('should return default if the user has an unsupported language', function () {
    var user = {
      languages: ['zz']
    };
    var lang = language.getUserLocale(user);
    lang.code.should.startWith('en');
  });

  it('should not return anything if the user does not have a language', function () {
    var user1 = {
      languages: []
    };
    var user2 = {};
    var lang1 = language.getUserLocale(user1);
    var lang2 = language.getUserLocale(user2);
    should.not.exist(lang1);
    should.not.exist(lang2);
  });

  it('should detect a requests language', function () {
    var request = {
      headers: {
        'accept-language': 'fr'
      }
    };
    var lang = language.getRequestLocale(request);
    lang.code.should.equal('fr');
  });

  it('should return nothing if there is not accept-language header', function () {
    var request = {
      headers: {
      }
    };
    var lang = language.getRequestLocale(request);
    should.not.exist(lang);
  });

  it('should return default language if unsupported is provided', function () {
    var request = {
      headers: {
        'accept-language': 'zz'
      }
    };
    var lang = language.getRequestLocale(request);
    lang.code.should.startWith('en');
  });

});
