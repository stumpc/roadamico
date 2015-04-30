/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Place = require('../api/place/place.model');
var List = require('../api/list/list.model');
var Event = require('../api/event/event.model');
var Group = require('../api/group/group.model');
var faker = require('faker');
var _ = require('lodash');
var Q = require('q');
var mp = require('../components/mongoosePromise');
var moment = require('moment');

function placeInRome() {
  return [
    Math.random() * 0.085596 + 41.949884, // 41.949884 - 41.864288
    Math.random() * 0.198097 + 12.400131  // 12.400131 - 12.598228
  ];
}

function randInt(upto) {
  return Math.floor(Math.random() * upto);
}


var users = [new User({
  email: 'admin@admin.com',
  name: 'admin',
  password: 'admin',
  activated: true,
  role: 'admin'
})];
_.times(10, function (i) {
  users.push({
    email: 'testuser' + i + '@roadamico.com',
    name: 'test user ' + i,
    password: 'password',
    activated: true,
    role: 'user'
  })
});


var groups = [{
  name: 'Group 1',
  emails: [users[0].email, users[1].email, users[2].email]
}, {
  name: 'Group 2',
  emails: [users[0].email, users[1].email]
}, {
  name: 'Group 3',
  emails: [users[0].email]
}];

function assignGroups() {
  users[0].groups = [groups[0]._id, groups[1]._id, groups[2]._id];
  users[1].groups = [groups[0]._id, groups[1]._id];
  users[2].groups = [groups[0]._id];
}


function feedPost() {
  var base = {
    datetime: moment().subtract(randInt(50), 'days').toISOString(),
    poster: users[randInt(users.length)]._id
  };
  return _.merge(base, [{
    photo: faker.image.city()
  }, {
    text: faker.lorem.sentences(3)
  }, {
    embed: {
      type: 'rich',
      thumbnail_url: faker.image.nightlife(),
      title: faker.company.catchPhrase(),
      description: faker.lorem.paragraphs(1)
    }
  }][randInt(3)]);
}

var places = [];
function generatePlaces() {
  places = _.times(10, function () {
    var pos = placeInRome();
    return new Place({
      //name: 'Place de ' + faker.name.lastName(),
      //location: faker.address.streetAddress() + ' ' + faker.address.streetName() + ', Rome, Italy',
      locationDetails: {
        name: 'Place de ' + faker.name.lastName(),
        formatted_address: faker.address.streetAddress() + ' ' + faker.address.streetName() + ', Rome, Italy',
        formatted_phone_number: faker.phone.phoneNumber(),
        geometry: {location: {k: pos[0], D: pos[1]}}
      },
      //phone: faker.phone.phoneNumber(),
      description: faker.lorem.paragraphs(randInt(4) + 2),
      feed: _.times(8, feedPost),
      ratings: _.times(2, function () {
        return {
          datetime: moment().subtract(randInt(50), 'days').toISOString(),
          poster: users[randInt(7)+1]._id,
          score: randInt(5) + 1
        };
      })
    });
  });
}

function randomListEntry() {
  var entry = {
    datetime: moment().toISOString(),
    poster: users[randInt(users.length)]._id
  };
  [ // Place, Rich text, Embed
    function () { entry.place = places[randInt(places.length)]._id; },
    function () { entry.text = '<p>' + faker.lorem.paragraphs(2) + '</p>'; },
    function () { entry.embed = {thumbnail_url: faker.image.nightlife(), title: faker.company.catchPhrase()}; }
  ][randInt(3)]();
  return entry;
}

var lists = [];
function generateLists() {
  lists = _.times(10, function () {
    return new List({
      name: faker.company.catchPhrase(),
      curated: false,
      entries: _.times(10, randomListEntry)
    });
  });
}

var events = [];
function generateEvents() {
  places.forEach(function (place) {
    _.times(10, function (i) {
      events.push({
        name: 'Event ' + i + ' at ' + place.locationDetails.name,
        place: place._id,
        datetime: moment().add(randInt(15) - 7, 'days').toISOString(),
        created: moment().toISOString(),
        meetupTime: (randInt(7)+1) + ':00 PM',
        meetupPlace: faker.address.streetAddress(),
        canceled: false,
        participants: _.times(randInt(6)+1, function (i) {
          return {
            participant: users[i+2]._id,
            datetime:moment().subtract(randInt(7) + 3, 'days').toISOString()
          }
        }),
        creator: users[randInt(7)+1]._id
      });
    });
  });
}


function createGroups() {
  var deferred = Q.defer();
  Group.remove({}, function () {
    Group.create(groups, function () {
      for (var i = 0; i < groups.length; i++) {
        groups[i] = arguments[1 + i];
      }
      deferred.resolve();
    });
  });
  return deferred.promise;
}

function createUsers() {
  assignGroups();
  var deferred = Q.defer();
  User.remove({}, function () {
    User.create(users, function () {
      for (var i = 0; i < users.length; i++) {
        users[i] = arguments[1 + i];
      }
      deferred.resolve();
    });
  });
  return deferred.promise;
}

function createPlaces() {
  generatePlaces();
  var deferred = Q.defer();
  Place.remove({}, function () {
    Place.create(places, function () {
      for (var i = 0; i < places.length; i++) {
        places[i] = arguments[1 + i];
      }
      deferred.resolve();
    });
  });
  return deferred.promise;
}

function createLists() {
  generateLists();
  var deferred = Q.defer();
  List.remove({}, function () {
    List.create(lists, function () {
      for (var i = 0; i < lists.length; i++) {
        lists[i] = arguments[1 + i];
      }
      deferred.resolve();
    });
  });
  return deferred.promise;
}

function createEvents() {
  generateEvents();
  var deferred = Q.defer();
  Event.remove({}, function () {
    Event.create(events, function () {
      for (var i = 0; i < events.length; i++) {
        events[i] = arguments[1 + i];
      }
      deferred.resolve();
    });
  });
}


console.log('Seeding DB');
createGroups()
  .then(function () {
    console.log('Groups created');
    return createUsers();
  })
  .then(function () {
    console.log('Users created');
    return createPlaces();
  })
  .then(function () {
    console.log('Places created');
    return createLists();
  })
  .then(function () {
    console.log('Lists created');
    return createEvents();
  })
  .then(function () {
    console.log('Events created');
  });

