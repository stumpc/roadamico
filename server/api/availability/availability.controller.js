'use strict';

var _ = require('lodash');
var moment = require('moment');
var mustache = require('mustache');
var Availability = require('./availability.model');
var Service = require('../service/service.model');
var translate = require('../../components/translate');
var communication = require('../../components/communication');
var payments = require('../../components/payments');
var mp = require('../../components/mongoosePromise');
var Q = require('q');

// Get list of availabilities
//exports.index = function(req, res) {
//  Availability.find(function (err, availabilities) {
//    if(err) { return handleError(res, err); }
//    return res.json(200, availabilities);
//  });
//};

exports.getAll = function (req, res) {
  Availability.find({
    service: req.params.id
  }).exec(function (err, availabilities) {
    if(err) { return handleError(res, err); }
    return res.json(availabilities);
  });
};

exports.getUpcoming = function (req, res) {
  Availability.find({
    service: req.params.id,
    timestamp: { $gte: moment().valueOf() }
  }).exec(function (err, availabilities) {
    if(err) { return handleError(res, err); }
    return res.json(availabilities);
  });
};

// Get a single availability
exports.show = function(req, res) {
  Availability.findById(req.params.id, function (err, availability) {
    if(err) { return handleError(res, err); }
    if(!availability) { return res.send(404); }
    return res.json(availability);
  });
};



/*
  ====================================================================================

    Creation

    There are two different ways to create availabilities.
    1. A single availability
    2. A repeating availability

    A repeating availability actually creates each repeated availability as its own
    instance. However, they are linked back to the first instance. In order to
    modify all the instances or all the instances after a certain time, then we
    just make a query looking for a particular value in the link.

    However, we will have two different actions and endpoints for creating due to
    the fact that one will return an object and the other will return an array. It
    make more semantic sense, and works better with Angular's $resource.

  ====================================================================================
 */

function createAvailability(req) {
  var deferred = Q.defer();

  delete req.body.booking;
  req.body.timestamp = moment(req.body.datetime).valueOf();
  if (typeof req.body.service === 'object') {
    req.body.service = req.body.service._id;
  }

  mp.wrap(Service.findById(req.body.service))

    // Check that the user owns the service and create the availability
    .then(function (service) {
      if (!service.provider.equals(req.user._id)) throw { code: 403, message: translate(req, 'service-unauthorized') };
      req.body.repeat = _.omit(req.body.repeat, 'first');
      return mp.wrapCall(function (cb) { Availability.create(req.body, cb); });
    })
    .then(function (availability) {
      deferred.resolve(availability);
    });

  return deferred.promise;
}


// Creates a new availability in the DB.
exports.create = function(req, res, next) {
  delete req.body.repeat;
  createAvailability(req)
    .then(function (availability) {
      res.json(201, availability);
    })
    .catch(handlePromiseError(res, next));
};

exports.createRepeat = function (req, res, next) {

  var availability;
  createAvailability(req)
    .then(function (_availability) {
      availability = _availability;

      // Repeats
      var repeats = [];
      var end = moment(availability.repeat.end);
      var next = moment(availability.datetime).add(1, availability.repeat.period);

      // Keep creating repeats until we hit the end date
      // TODO: Determine a safeguard so we don't create too many. For now limiting to 200
      while (next <= end && repeats.length < 200) {
        var repeat = _.extend({}, req.body);
        repeat.repeat.first = availability._id;
        repeat.datetime = next.toISOString();
        repeat.timestamp = next.valueOf();
        repeats.push(repeat);
        next = next.add(1, availability.repeat.period);
      }

      return mp.wrapCall(function (cb) { Availability.create(repeats, cb); });
    })

    // Return the results
    .then(function (availabilities) {
      availabilities.unshift(availability);
      res.json(201, availabilities);
    })
    .catch(handlePromiseError(res, next));
};

// Updates an existing availability in the DB.
exports.update = function(req, res) {

  // TODO: Do something if its a repeated one
  delete req.body.repeat;

  delete req.body._id;
  delete req.body.booking;
  if (req.body.datetime) {
    req.body.timestamp = moment(req.body.datetime).valueOf();
  }
  if (typeof req.body.service === 'object') {
    req.body.service = req.body.service._id;
  }


  Service.findById(req.body.service).exec(function (err, service) {
    if (err) { return handleError(res, err); }

    // Check the service
    if (service.provider.equals(req.user._id)) {
      Availability.findById(req.params.id, function (err, availability) {
        if (err) { return handleError(res, err); }
        if(!availability) { return res.send(404); }

        var updated = _.merge(availability, req.body);
        updated.save(function (err) {
          if (err) { return handleError(res, err); }
          return res.json(200, availability);
        });
      });

    } else {
      return res.json(403, { message: translate(req, 'service-unauthorized') });
    }
  });
};

// Deletes a availability from the DB.
exports.destroy = function(req, res) {

  // TODO: Do something if its already booked

  // TODO: Do something if its a repeated one

  Availability.findById(req.params.id, function (err, availability) {
    if(err) { return handleError(res, err); }
    if(!availability) { return res.send(404); }
    availability.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};


/**
 * Books an availability, processes the payment, and notifies both parties.
 * @param req
 * @param res
 * @param next
 */
exports.book = function (req, res, next) {

  var availability;
  mp.wrap(Availability.findById(req.body._id))

    // Mark it as booked
    .then(function (availability) {
      availability.booking = {
        booker: req.user._id,
        updates: [{
          time: moment().toISOString(),
          status: 'booked'
        }]
      };
      return mp.wrap(availability, 'save');
    })

    // Make a payment
    .then(function (_availability) {
      availability = _availability;
      return payments.create({ amount: _availability.cost });
    })

    // Mark it as paid
    .then(function (confirmation) {
      availability.booking.updates.push({
        time: moment().toISOString(),
        status: 'paid'
      });
      return mp.wrap(availability, 'save');
    })

    // Get the associated service
    .then(function (_availability) {
      availability = _availability;
      return mp.wrap(Service.findById(availability.service).populate('provider', 'name email languages'));
    })

    // Send out notifications
    .then(function (service) {
      // Notify the booker
      communication.soft({
        to: req.user,
        message: mustache.render(translate(req, 'notify.booked-booker'), {
          service: service.name,
          provider: service.provider.name,
          time: moment(availability.datetime).format('LLLL') // Localized format
        })
      });

      // Notify the provider
      communication.hard({
        to: service.provider,
        message: mustache.render(translate(service.provider, 'notify.booked-provider'), {
          service: service.name,
          booker: req.user.name,
          time: moment(availability.datetime).format('LLLL') // Localized format
        })
      });

      res.json(availability);
    })
    .catch(function (err) {
      next(err);
    });
};


/**
 * Cancels a booking
 * @param req
 * @param res
 * @param next
 */
exports.cancel = function (req, res, next) {

  var availability;
  mp.wrap(Availability.findById(req.body._id))

    // Make sure that the user is the booker and mark it as canceled
    .then(function (availability) {
      if (!availability.booking.booker.equals(req.user._id)) {
        throw { code: 403, message: translate(req, 'avail-unauthorized') };
      }
      availability.booking.updates.push({
        time: moment().toISOString(),
        status: 'canceled'
      });
      return mp.wrap(availability, 'save');
    })

    // Cancel payment
    .then(function (_availability) {
      availability = _availability;
      return payments.cancel({ amount: _availability.cost });
    })

    // Get the associated service
    .then(function (confirmation) {
      return mp.wrap(Service.findById(availability.service).populate('provider', 'name email languages'));
    })

    // Send out notifications
    .then(function (service) {
      // Notify the booker
      communication.soft({
        to: req.user,
        message: mustache.render(translate(req, 'notify.canceled-booker'), {
          service: service.name,
          provider: service.provider.name,
          time: moment(availability.datetime).format('LLLL') // Localized format
        })
      });

      // Notify the provider
      communication.hard({
        to: service.provider,
        message: mustache.render(translate(service.provider, 'notify.canceled-provider'), {
          service: service.name,
          booker: req.user.name,
          time: moment(availability.datetime).format('LLLL') // Localized format
        })
      });

      res.json(availability);
    })
    .catch(handlePromiseError(res, next));
};

exports.mine = function (req, res, next) {
  console.log('*** got here');
  Availability.find({
    'booking.booker': req.user._id
  }).populate('service', 'name').exec(function (err, availabilities) {
    if (err) return next(err);
    return res.json(availabilities);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

function handlePromiseError(res, next) {
  return function (err) {
    if (err.code) {
      res.json(err.code, err);
    } else {
      next(err);
    }
  };
}
