'use strict';

var should = require('should');
var translate = require('./index');

describe('Translation service', function () {

  it('should use the translation', function () {
    var translation1 = translate('en', 'test');
    var translation2 = translate('fr', 'test');
    translation1.should.equal('Hello world');
    translation2.should.equal('Bonjour monde');
  });

  it('should use the simple code for translation if not found', function () {
    var translation1 = translate('en_pirate', 'test');
    var translation2 = translate('en_monkey', 'test');
    translation1.should.equal('Arrg! Hello world mateys');
    translation2.should.equal('Hello world');
  });

  it('should fall back to the default language if not found', function () {
    var translation = translate('zz', 'test');
    translation.should.equal('Hello world');
  });

  it('should return the key if the translation isnt found', function () {
    var translation = translate('en', 'test-noexist');
    translation.should.equal('test-noexist');
  });

  it('should use users language', function () {
    var user = {
      _id: 'test', name: 'test',
      languages: ['fr']
    };
    var translation = translate(user, 'test');
    translation.should.equal('Bonjour monde');
  });

  it('should use request language', function () {
    var request = {
      headers: {
        'accept-language': 'fr'
      }
    };
    var translation = translate(request, 'test');
    translation.should.equal('Bonjour monde');
  });

  it('should use request users language', function () {
    var request = {
      user: {
        _id: 'test', name: 'test',
        languages: ['fr']
      },
      headers: {}
    };
    var translation = translate(request, 'test');
    translation.should.equal('Bonjour monde');
  });

  it('should use request language if the request user has no languages', function () {
    var request = {
      user: {
        _id: 'test', name: 'test',
        languages: []
      },
      headers: {
        'accept-language': 'fr'
      }
    };
    var translation = translate(request, 'test');
    translation.should.equal('Bonjour monde');
  });

});
