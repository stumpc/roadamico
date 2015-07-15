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

// Can view if admin, not restricted and published, or member of restriction group and published
var canView = _.curry(function (user, list) {
  var a = !(list.groupRestriction && list.groupRestriction.length) && list.published;
  if (!user) {
    return a;
  }
  var b = user.role === 'admin' || user.role === 'curator';
  var c = !!_.find(list.groupRestriction, function (group) {
    return (group && group.administrator && group.administrator.equals(user._id)) || !!_.find(user.groups, function (groupId) {
      return group._id.equals(groupId);
    });
  }) && list.published;
  var d = !!_.find(list.owners, function (owner) {
    return owner.equals(user._id);
  });
  return a || b || c || d;
});

// Can edit if admin, owner of list, leader of restriction group, or list is open
var canEdit = _.curry(function (user, list) {
  var a = user.role === 'admin' || user.role === 'curator';
  var b = !!_.find(list.owners, function (userId) {
    return userId.equals(user._id);
  });
  var c = !!_.find(list.groupRestriction, function (group) {
    return group.administrator && group.administrator.equals(user._id);
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
  //List.find({}).sort({ 'name': 'asc'})
  List.find({})
    .populate('groupRestriction', 'administrator')
    .exec(function (err, lists) {
      if (err) {
        return handleError(res, err);
      }
      lists = _.filter(lists, canView(req.user));
      lists.sort(function(o1, o2) {
          return naturalSorter(o1.name, o2.name);
      });

      return res.json(200, lists);
    });
};

// FOR ALPHANUMERIC SORT
var naturalSorter = function (as, bs){
    var a, b, a1, b1, i= 0, n, L,
        rx=/(\.\d+)|(\d+(\.\d+)?)|([^\d.]+)|(\.\D+)|(\.$)/g;
    if(as=== bs) return 0;
    a= as.toLowerCase().match(rx);
    b= bs.toLowerCase().match(rx);
    L= a.length;
    while(i<L){
        if(!b[i]) return 1;
        a1= a[i],
            b1= b[i++];
        if(a1!== b1){
            n= a1-b1;
            if(!isNaN(n)) return n;
            return a1>b1? 1:-1;
        }
    }
    return b[i]? -1:0;
}

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
    .populate('entries.place', 'locationDetails ratings feed description')
    //.populate('owners', 'email name')
    .populate('groupRestriction', 'administrator name')
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
      list.published = req.body.published || list.published;

      list.save(function (err, list) {
        if (err) {
          return handleError(res, err);
        }
        var populateOpts = [
          {path: 'entries.place', select: 'locationDetails ratings feed description'},
          {path: 'groupRestriction', select: 'administrator name'}
        ];
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

// For Rating a Playlist
exports.rate = function (req, res) {
    List.findById(req.params.id, function (err, list) {
        if(err) { return handleError(res, err); }
        if(!list) { return res.send(404); }

        // See if this user has already rated
        var rating = _.find(list.ratings, function (rating) {
            return req.user._id.equals(rating.poster);
        });
        if (rating) {
            rating.datetime = moment().toISOString();
            rating.score = req.body.score;
        } else {
            list.ratings.push({
                datetime: moment().toISOString(),
                poster: req.user._id,
                score: req.body.score
            });
        }
        list.save(function(err, list) {
            if(err) { return handleError(res, err); }
            return res.send(200, list);
        });
    });
};