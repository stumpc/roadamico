/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var Signup = require('../api/signup/signup.model');
var Service = require('../api/service/service.model');
var Category = require('../api/category/category.model');
var faker = require('faker');
var _ = require('lodash');

// Remove all signups
Signup.find({}).remove();


// Random service creator
//var categories = [
//  'Amusement Park',
//  'Badminton',
//  'Baseball',
//  'Basketball',
//  'Billiards',
//  'Board Games',
//  'Boating',
//  'Bowling',
//  'Bungee Jumping',
//  'Cycling',
//  'Fishing',
//  'Golf',
//  'Hiking',
//  'Horse Riding',
//  'Lawn Tennis',
//  'Museum Visit',
//  'Nature Walk',
//  'Painting',
//  'River Rafting',
//  'Scuba Diving',
//  'Surfing',
//  'Swimming',
//  'Table Tennis',
//  'Team Games',
//  'Volleyball'
//];

// Remove all categories
var categories = [
  {
    name: 'Outdoor sports',
    aliases: ['recreation', 'parks'],
    color: 'lavendar-light',
    children: [
      { name: 'Golfing' },
      { name: 'Surfing' },
      { name: 'Tennis' },
      { name: 'Camping' }
    ]
  },
  {
    name: 'Indoor activities',
    children: [
      {
        name: 'Indoor sports',
        children: [
          { name: 'Table Tennis' }
        ]
      },
      {
        name: 'Leisure activities',
        children: [
          { name: 'Massage' },
          { name: 'Conversation' }
        ]
      }
    ]
  }
];

Category.find({}).remove(function () {
  var seen = 0;
  var created = 0;
  function createCategory(categories, parent) {
    seen += categories.length;
    categories.forEach(function (category) {
      category.parent = parent;
      Category.create(category, function (err, c) {
        if (category.children && category.children.length) {
          createCategory(category.children, c._id);
        }

        created++;
        if (created === seen) {
          createUsers();
        }
      });
    });
  }

  console.log('Creating categories');
  createCategory(categories);
});

function createUsers() {
  User.find({}).remove(function () {
    User.create({
      provider: 'local',
      name: 'Test User',
      email: 'test@test.com',
      password: 'test',
      activated: true,
      verification: {
        status: 'pending',
        idUrl: faker.image.abstract(600, 400)
      }
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@admin.com',
      password: 'admin',
      activated: true
    }, {
      provider: 'local',
      name: 'Joe',
      email: 'asdfasdf',
      password: 'joe',
      activated: false,
      modCode: '1234'
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
        location: [faker.address.city(), faker.address.state(), faker.address.zipCode()][Math.floor(Math.random * 3)],
        workplace: faker.company.companyName(),
        bio: faker.lorem.paragraph(),
        photo: faker.image.avatar(400, 400),

        publicInfo: {
          phone: Math.random() < 0.5,
          location: Math.random() < 0.5,
          workplace: Math.random() < 0.5
        },

        verification: {
          status: ['none', 'pending', 'approved', 'denied'][Math.floor(Math.random() * 4)],
          idUrl: faker.image.abstract(600, 400)
        },
        activated: true
      }
    });
    console.log('Creating fake users...');
    User.create(guys, function () {
      User.find({}, function (err, users) {

        Category.find({}, function (err, categories) {

          // Now have each user offer a service
          console.log('Creating services...');
          Service.find({}).remove(function () {
            console.log('Creating fake services');
            _.times(2, function () {
              users.forEach(function (user) {
                var category = categories[Math.floor(Math.random()*categories.length)];
                Service.create({
                  name: category.name + ' with ' + user.name,
                  description: faker.hacker.phrase(),
                  category: category._id,
                  location: user.location,
                  provider: user
                });
              });
            });
          });
        });
      });
    });
  });
}
