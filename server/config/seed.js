/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var Category = require('../api/category/category.model');
var Service = require('../api/service/service.model');
var faker = require('faker');
var _ = require('lodash');

Thing.find({}).remove(function() {
  Thing.create({
    name : 'Development Tools',
    info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
    name : 'Server and Client integration',
    info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
    name : 'Smart Build System',
    info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  },  {
    name : 'Modular Structure',
    info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
  },  {
    name : 'Optimized Build',
    info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  },{
    name : 'Deployment Ready',
    info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  });
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  });

  // Create a bunch of fake guys
  var guys = _.times(25, function (n) {
    return {
      provider: 'local',
      name: faker.name.findName(),
      email: faker.internet.email(),
      emailPublic: true,
      password: 'test',
      phone: faker.phone.phoneNumber(),
      location: faker.address.streetAddress() + ", " + faker.address.city() + ", " + faker.address.state() + " " + faker.address.zipCode(),
      workplace: faker.company.companyName(),
      bio: faker.lorem.paragraph(),
      photo: faker.image.avatar(400, 400),

      publicInfo: {
        phone: Math.random()<.5,
        location: Math.random()<.5,
        workplace: Math.random()<.5
      },

      verification: {
        status: ['none', 'pending', 'approved', 'denied'][~~(Math.random()*4)],
        idUrl: faker.image.abstract(600, 400)
      }
    }
  });
  console.log('Creating fake users...');
  User.create(guys);

});

Category.find({}).remove(function () {
  var numColors = 8;
  var categories = [
    'Amusement Park',
    'Badminton',
    'Baseball',
    'Basketball',
    'Billiards',
    'Board Games',
    'Boating',
    'Bowling',
    'Bungee Jumping',
    'Cycling',
    'Fishing',
    'Golf',
    'Hiking',
    'Horse Riding',
    'Lawn Tennis',
    'Museum Visit',
    'Nature Walk',
    'Painting',
    'River Rafting',
    'Scuba Diving',
    'Surfing',
    'Swimming',
    'Table Tennis',
    'Team Games',
    'Volleyball'
  ].map(function (category) {
      return {
        name: category,
        colorCode: ~~(Math.random()*numColors)
      }
    });

  console.log('Creating categories...');
  Category.create(categories);

});
