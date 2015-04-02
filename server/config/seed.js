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
var Rating = require('../api/rating/rating.model');
var Availability = require('../api/availability/availability.model');
var faker = require('faker');
var _ = require('lodash');
var Q = require('q');
var mp = require('../components/mongoosePromise');
var moment = require('moment');

// Utility

function randomLocation() {
  return faker.address.streetAddress() + ' ' + faker.address.streetName() + ', ' +
    faker.address.city() + ', ' + faker.address.state() + ' ' + faker.address.zipCode();
}

function randomLocationDetails() {
  return {
    geometry: {
      location: {
        k: faker.address.latitude(),
        D: faker.address.longitude()
      }
    }
  };
}

function randomDuration() {
  var unit = ['minute', 'hour'][Math.round(Math.random())];
  var time;
  if (unit === 'minute') {
    time = (Math.floor(Math.random() * 6) + 1) * 15
  } else {
    time = Math.floor(Math.random() * 3) + 1;
  }
  return time + ' ' + unit;
}

// ------------------------
//          Data
// ------------------------

// Category data

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

// User data

var users = [
  {
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test',
    activated: true,
    verification: {
      status: 'pending',
      idUrl: faker.image.abstract(600, 400)
    }
  },
  {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin',
    activated: true
  },
  {
    provider: 'local',
    name: 'Joe',
    email: 'joe@joe.com',
    password: 'joe',
    activated: false,
    modCode: '1234'
  }
];

_.times(25, function () {
  users.push({
    provider: 'local',
    name: faker.name.findName(),
    email: faker.internet.email(),
    emailPublic: true,
    password: 'test',
    phone: faker.phone.phoneNumber(),
    location: randomLocation(),
    locationDetails: randomLocationDetails(),
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
  });
});

// Service data

var services = [];
_.times(25, function () {
  // Provider and category will be assigned randomly later
  services.push({
    created: moment().toISOString(),
    name: faker.hacker.ingverb(),
    description: faker.hacker.phrase(),
    location: randomLocation(),
    locationDetails: randomLocationDetails()
  });
});

// Availability data

// These availabilities will be created for each service
var availabilities = [];
_.times(3, function () {
  var time = moment().add(Math.floor(Math.random() * 5) + 1, 'day');
  time = time.add(Math.floor(Math.random() * 8) - 4, 'hours');
  availabilities.push({
    created: moment().toISOString(),
    datetime: time.toISOString(),
    timestamp: time.valueOf(),
    duration: randomDuration(),
    cost: Math.floor(Math.random() * 10000) / 100
  });
});

// ------------------------
//   Data seeding process
// ------------------------


var data = {
  users: {},
  categories: {},
  services: {}
};

function randomObject(collection) {
  var ids = Object.keys(collection);
  var id = ids[Math.floor(Math.random() * ids.length)];
  return collection[id];
}

function allObjects(collection) {
  return Object.keys(collection).map(function (id) {
    return collection[id];
  });
}




function createCategory(category, parent) {
  category.parent = parent;
  return mp.wrapCall(function (cb) { Category.create(category, cb); })
    .then(function (newCategory) {
      data.categories[newCategory._id] = newCategory;
      Q.all(category.children.map(function (child) {
        return createCategory(child, newCategory._id);
      }));
    });
}

function createUser(user) {
  return mp.wrapCall(function (cb) { User.create(user, cb); })
    .then(function (user) {
      data.users[user._id] = user;
    });
}

function createService(service) {
  var category = randomObject(data.categories);
  var provider = randomObject(data.users);
  service.category = category._id;
  service.provider = provider._id;
  return mp.wrapCall(function (cb) { Service.create(service, cb)})
    .then(function (service) {
      data.services[service._id] = service;
    });
}

function createAvailabilities(service) {
  return Q.all(availabilities.map(function (availability) {
    availability.service = service._id;
    return mp.wrapCall(function (cb) { Availability.create(availability, cb); });
  }));
}





console.log('Removing all data...');
Q.all([
  mp.wrap(User.find({}).remove()),
  mp.wrap(Signup.find({}).remove()),
  mp.wrap(Service.find({}).remove()),
  mp.wrap(Category.find({}).remove()),
  mp.wrap(Rating.find({}).remove()),
  mp.wrap(Availability.find({}).remove())
])

  // Create Categories
  .then(function () {
    console.log('Done removing data.');
    console.log('Creating categories...');
    return Q.all(categories.map(function (category) {
      return createCategory(category);
    }));
  })

  // Create Users
  .then(function () {
    console.log('Done creating categories.');
    console.log('Creating users...');
    return Q.all(users.map(createUser));
  })

  // Create Services
  .then(function () {
    console.log('Done creating users.');
    console.log('Creating services...');
    return Q.all(services.map(createService));
  })

  // Create availabilities
  .then(function () {
    console.log('Done creating services.');
    console.log('Creating availabilities...');
    return Q.all(allObjects(data.services).map(function (service) {
      return createAvailabilities(service);
    }));
  });
