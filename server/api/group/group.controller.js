'use strict';

var _ = require('lodash');
var Group = require('./group.model');
var User = require('../user/user.model');
var Notification = require('../notification/notification.model');
var upload = require('../../components/upload');
var mp = require('../../components/mongoosePromise');
var moment = require('moment');
var email = require('../../components/communication/email');

// Get list of approved groups
exports.index = function (req, res) {
  Group.find({approved: true}, function (err, groups) {
    if (err) {
      return handleError(res, err);
    }

    groups.forEach(function (group) {
      //delete group.emails;
      delete group.requests;
    });
    return res.json(200, groups);
  });
};

// Get list of unapproved groups
exports.unapproved = function (req, res) {
  Group.find({approved: false}, function (err, groups) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, groups);
  });
};

// Returns a list of groups that the user is allowed to join
exports.allowed = function (req, res) {
  Group.find({approved: true, emails: req.user.email}, function (err, groups) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, groups);
  });
};

// Returns a list of groups that the user is allowed to join
exports.check = function (req, res) {
  Group.find({approved: true, emails: req.params.email}, function (err, groups) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, groups);
  });
};

// Joins the user to groups
exports.join = function (req, res) {
  // Remove groups that the user is already a member of
  req.body.groups = _.filter(req.body.groups, function (id) {
    return !_.find(req.user.groups, function (id2) {
      return id2.equals(id);
    });
  });
  Group.find({approved: true, emails: req.user.email, _id: {$in: req.body.groups}}, function (err, groups) {
    if (err) {
      return handleError(res, err);
    }
    groups.forEach(function (group) {
      req.user.groups.push(group);
    });
    req.user.save(function (err, user) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(200, user.groups);
    });
  });
};

// Gets the groups that the user is a member of
exports.mine = function (req, res) {
  Group.find({$or: [{_id: {$in: req.user.groups}}, {administrator: req.user._id}]}, function (err, groups) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, groups);
  });
};

// Gets the groups that the user is the administrator of
exports.own = function (req, res) {
  Group.find({administrator: req.user._id}, function (err, groups) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, groups);
  });
};

exports.members = function (req, res) {
  Group.findOne({_id: req.params.id, administrator: req.user._id}, function (err, group) {
    if (err) {
      return handleError(res, err);
    }
    if (!group) {
      return res.send(404);
    }

    User.find({groups: group._id}, function (err, users) {
      if (err) {
        return handleError(res, err);
      }

      return res.json(users.map(function (user) {
        return user.profile;
      }));
    });
  });
};

exports.removeMember = function (req, res) {
  Group.findOne({_id: req.params.id, administrator: req.user._id}, function (err, group) {
    if (err) {
      return handleError(res, err);
    }
    if (!group) {
      return res.send(404);
    }

    User.findOne({_id: req.params.memberId, groups: group._id}, function (err, user) {
      if (err) {
        return handleError(res, err);
      }
      var idx = _.findIndex(user.groups, function (groupId) {
        return group._id.equals(groupId);
      });
      user.groups.splice(idx, 1);
      user.save(function (err) {
        if (err) {
          return handleError(res, err);
        }

        res.json(200, {
          message: 'User removed from group',
          groupId: group._id,
          userId: user._id
        });
      });
    });
  });
};

// Get a single group
exports.show = function (req, res) {
  Group.findById(req.params.id, function (err, group) {
    if (err) {
      return handleError(res, err);
    }
    if (!group) {
      return res.send(404);
    }
    if (req.user.role !== 'admin' && !req.user._id.equals(group.administrator)) {
      return res.send(404);
    }
    return res.json(group);
  });
};

// Creates a new group in the DB.
exports.create = function (req, res) {
  req.body.approved = true;
  req.body.administrator = req.user;
  Group.create(req.body, function (err, group) {
    if (err) {
      return handleError(res, err);
    }

    res.send(201, group);
  });
};

// Updates an existing group in the DB.
exports.update = function (req, res) {
  delete req.body._id;
  Group.findById(req.params.id, function (err, group) {
    if (err) {
      return handleError(res, err);
    }
    if (!group) {
      return res.send(404);
    }
    if (req.user.role !== 'admin' && !req.user._id.equals(group.administrator)) {
      return res.send(404);
    }
    var updated = _.merge(group, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, group);
    });
  });
};

// Deletes a group from the DB.
exports.destroy = function (req, res) {
  Group.findById(req.params.id, function (err, group) {
    if (err) {
      return handleError(res, err);
    }
    if (!group) {
      return res.send(404);
    }
    if (req.user.role !== 'admin' && !req.user._id.equals(group.administrator)) {
      return res.send(404);
    }
    group.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

// Approves a group
exports.approve = function (req, res) {
  Group.findById(req.params.id, function (err, group) {
    if (err) {
      return handleError(res, err);
    }
    if (!group) {
      return res.send(404);
    }
    group.approved = true;
    group.save(function (err, group) {
      if (err) {
        return handleError(res, err);
      }

      // Notify the group owner
      Notification.create({
        user: group.administrator,
        data: {
          name: 'group.approve',
          group: {
            id: '' + group._id,
            name: group.name
          }
        }
      });

      res.json(group);
    });
  });
};

// Request for access to a group
exports.requestAccess = function (req, res) {
  req.body.email = req.body.email.toLowerCase();
  Group.findById(req.params.id, function (err, group) {
    if (err) {
      return handleError(res, err);
    }
    if (!group) {
      return res.send(404);
    }
    group.requests.push(req.body);
    group.save(function (err, group) {
      if (err) {
        return handleError(res, err);
      }

      // Notify the group owner
      Notification.create({
        user: group.administrator,
        data: {
          name: 'group.request',
          group: {
            id: '' + group._id,
            name: group.name
          },
          request: {
            name: req.body.name,
            email: req.body.email,
            message: req.body.message
          }
        }
      });

      delete group._doc.emails;
      delete group._doc.requests;
      res.json(group);
    });
  });
};

exports.invite = function (req, res) {
  req.body.email = req.body.email.toLowerCase();
  Group.findOne(req.params.id, function (err, group) {
    if (err) {
      return handleError(res, err);
    }
    if (!group) {
      return res.send(404);
    }

    // Check if allowed
    var approved = req.user.role === 'admin' ||   // Admins can invite
      req.user._id.equals(group.administrator) || // Group owners can invite
      _.contains(group.emails, req.user.email);   // Group members can invite
    if (!approved) {
      console.log('User role', req.user.role);
      console.log('User id', req.user._id + '');
      console.log('Group administrator', group.administrator + '');
      return res.send(403);
    }

    //console.log('Before:',group);
    //console.log('After:',group);
    group._doc.emails.push(req.body.email);
    group.save(function (err, group) {
      if (err) {
        return handleError(res, err);
      }
      //console.log('Saved:',group);

      // If the user w/ that email exists, then send a notification, otherwise send an email
      User.findOne({email: req.body.email}, function (err, user) {
        if (err) return;
        if (!user) {
          email('invite', {
            email: req.body.email,
            view: {
              inviter: req.user.name,
              group: {
                id: '' + group._id,
                name: group.name
              }
            }
          });
        } else {
          Notification.create({
            user: user._id,
            data: {
              inviter: req.user.name,
              name: 'group.invite',
              group: {
                id: '' + group._id,
                name: group.name
              }
            }
          });
        }
      });

      delete group._doc.emails;
      delete group._doc.requests;
      res.json(group);
    });
  });
};

exports.grantAccess = function (req, res) {
  Group.findById(req.params.id, function (err, group) {
    if (err) {
      return handleError(res, err);
    }
    if (!group) {
      return res.send(404);
    }
    if (req.user.role !== 'admin' && !req.user._id.equals(group.administrator)) {
      return res.send(404);
    }

    // Find and update the request
    var requestIndex = _.findIndex(group.requests, function (r) {
      return r._id.equals(req.params.rid);
    });
    if (requestIndex === -1) {
      return res.send(404);
    }
    var request = group._doc.requests.splice(requestIndex, 1)[0];
    group.emails.push(request.email);
    group.save(function (err, group) {
      if (err) {
        return handleError(res, err);
      }

      // Update requester's membership and notify
      User.findOne({email: request.email}, function (err, user) {
        if (err || !user) return res.json(200, group);
        Notification.create({
          user: user._id,
          data: {
            name: 'group.grant',
            group: {
              id: '' + group._id,
              name: group.name
            }
          }
        });

        user.groups.push(group._id);
        user.save(function (err) {
          return res.json(200, group);
        });
      });
    });
  });
};

exports.denyAccess = function (req, res) {
  Group.findById(req.params.id, function (err, group) {
    if (err) {
      return handleError(res, err);
    }
    if (!group) {
      return res.send(404);
    }
    if (req.user.role !== 'admin' && !req.user._id.equals(group.administrator)) {
      return res.send(404);
    }

    // Find and update the request
    var requestIndex = _.findIndex(group.requests, function (r) {
      return r._id.equals(req.params.rid);
    });
    if (requestIndex === -1) {
      return res.send(404);
    }
    var request = group._doc.requests.splice(requestIndex, 1)[0];
    group.save(function (err, group) {
      if (err) {
        return handleError(res, err);
      }

      // Notify the requester
      User.findOne({email: request.email}, function (err, user) {
        if (err || !user) return;
        Notification.create({
          user: user._id,
          data: {
            name: 'group.deny',
            group: {
              id: '' + group._id,
              name: group.name
            }
          }
        });
      });

      return res.json(200, group);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
