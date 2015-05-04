'use strict';

var _ = require('lodash');
var List = require('./list.model');
var moment = require('moment');
var upload = require('../../components/upload');
var Q = require('q');

/* Access control
 * See: https://github.com/camman3d/RoadAmico/wiki/List-Access-Control
 *
 * Notes about these functions:
 *   1. Curried, so you can call canView(user, list) or canView(user)(list)
 *   2. Requires groupRestriction to be populated with adminstrator
 */

// Can view if admin, not restricted, or member of restriction group
var canView = _.curry(function (user, list) {
  var a = !(list.groupRestriction && list.groupRestriction.length);
  if (!user) {
    return a;
  }
  var b = user.role === 'admin' || user.role === 'curator';
  var c = !!_.find(list.groupRestriction, function (group) {
    return !!_.find(user.groups, function (groupId) {
      return group._id.equals(groupId);
    });
  });
  return a || b || c;
});

// Can edit if admin, owner of list, leader of restriction group, or list is open
var canEdit = _.curry(function (user, list) {
  var a = user.role === 'admin' || user.role === 'curator';
  var b = !!_.find(list.owners, function (userId) {
    return userId.equals(user._id);
  });
  var c = !!_.find(list.groupRestriction, function (group) {
    return group.administrator.equals(user._id);
  });
  return a || b || c || list.open;
});


// Get list of visible lists
exports.publicIndex = function (req, res) {
  List.find({}, function (err, lists) {
      if (err) {
        return handleError(res, err);
      }
      lists = _.filter(lists, canView(null));
      return res.json(200, lists);
    });
};

// Get list of visible lists
exports.index = function (req, res) {
  List.find({})
    .populate('groupRestriction', 'administrator')
    .exec(function (err, lists) {
      if (err) {
        return handleError(res, err);
      }
      lists = _.filter(lists, canView(req.user));
      return res.json(200, lists);
    });
};

//exports.groupLists = function (req, res) {
//  console.log(req.user.groups);
//  List.find({groupRestriction: {$in: req.user.groups}})
//    .populate('entries.place', 'locationDetails ratings feed')
//    .exec(function (err, lists) {
//      if(err) { return handleError(res, err); }
//      res.json(lists);
//    });
//};

// Get a single list
exports.show = function (req, res) {
  List.findById(req.params.id)
    .populate('entries.place', 'locationDetails ratings feed')
    //.populate('owners', 'email name')
    .populate('groupRestriction', 'administrator')
    .exec(function (err, list) {
      if (err) {
        return handleError(res, err);
      }
      if (!list) {
        return res.send(404);
      }
      if(!canView(req.user, list)) {
        return res.send(403);
      }
      return res.json(list);
    });
};

// Creates a new list in the DB.
exports.create = function (req, res) {
  req.body.owners = [req.user._id];
  List.create(req.body, function (err, list) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(201, list);
  });
};

// Updates an existing list in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }

  // Un-populate
  req.body.entries.forEach(function (entry) {
    if (entry.place && entry.place._id) {
      entry.place = entry.place._id;
    }
  });

  List.findById(req.params.id)
    .populate('groupRestriction', 'administrator')
    .exec(function (err, list) {
      if (err) {
        return handleError(res, err);
      }
      if (!list) {
        return res.send(404);
      }
      if(!canEdit(req.user, list)) {
        return res.send(403);
      }

      list.entries = req.body.entries;
      list.name = req.body.name || list.name;
      list.groupRestriction = req.body.groupRestriction || list.groupRestriction;
      list.open = req.body.open || list.open;
      list.owners = req.body.owners || list.owners;
      list.tags = req.body.tags || list.tags;

      list.save(function (err, list) {
        if (err) {
          return handleError(res, err);
        }
        var populateOpts = {path: 'entries.place', select: 'locationDetails ratings feed'};
        list.populate(populateOpts, function (err, list) {
          if (err) {
            return handleError(res, err);
          }
          return res.json(200, list);
        });
      });
    });
};

exports.addEntry = function (req, res) {
  List.findById(req.params.id)
    .populate('groupRestriction', 'administrator')
    .exec(function (err, list) {
      if (err) {
        return handleError(res, err);
      }
      if (!list) {
        return res.send(404);
      }
      if(!canEdit(req.user, list)) {
        return res.send(403);
      }

      req.body.datetime = moment().toISOString();
      req.body.poster = req.user._id;
      list.entries.push(req.body);
      list.save(function (err, list) {
        if (err) return next(err);
        res.send(list);
      });
    });
};

// Deletes a list from the DB.
exports.destroy = function (req, res) {
  List.findById(req.params.id)
    .populate('groupRestriction', 'administrator')
    .exec(function (err, list) {
      if (err) {
        return handleError(res, err);
      }
      if (!list) {
        return res.send(404);
      }
      if(!canEdit(req.user, list)) {
        return res.send(403);
      }

      list.remove(function (err) {
        if (err) {
          return handleError(res, err);
        }
        return res.send(204);
      });
    });
};

function handleError(res, err) {
  return res.send(500, err);
}
