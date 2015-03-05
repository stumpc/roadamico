'use strict';

var _ = require('lodash');
var Message = require('./message.model');
var moment = require('moment');
var communication = require('../../components/communication');

// Get list of messages
exports.index = function (req, res) {
  Message.find({}).populate('to', 'name photo').populate('from', 'name photo').exec(function (err, messages) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, messages);
  });
};

// Gets the messages the current user has sent
exports.sent = function (req, res) {
  Message.find({from: req.user._id}).populate('to', 'name photo').populate('from', 'name photo').exec(function (err, messages) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, messages);
  });
};

// Gets the messages the current user has received
exports.received = function (req, res) {
  Message.find({to: req.user._id}).populate('to', 'name photo').populate('from', 'name photo').exec(function (err, messages) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, messages);
  });
};

// Gets the messages related the current user
exports.mine = function (req, res) {
  Message.find({
    $or: [
      {to: req.user._id},
      {from: req.user._id}
    ]
  }).populate('to', 'name photo').populate('from', 'name photo').exec(function (err, messages) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, messages);
  });
};

// Get a single message
exports.show = function (req, res) {
  Message.findById(req.params.id)
    .populate('to', 'name photo').populate('from', 'name photo').exec(function (err, message) {
      if (err) {
        return handleError(res, err);
      }
      if (!message) {
        return res.send(404);
      }

      if (!req.user._id.equals(message.to) && !req.user._id.equals(message.from)) {
        return res.send(403);
      }
      return res.json(message);
    });
};

// Creates a new message in the DB.
exports.create = function (req, res) {
  req.body.from = req.user._id;
  req.body.time = moment().toISOString();
  if (!req.body.to) {
    return res.json(403, {message: 'Missing "to" user'}); // TODO: Translate this message
  }

  communication.message({
    req:      req,
    to:       req.body.to,
    message:  req.body.message
  }).then(function (message) {
    res.json(201, message);
  }).catch(function (err) {
    handleError(res, err);
  });

  //Message.create(req.body, function (err, message) {
  //  if (err) {
  //    return handleError(res, err);
  //  }
  //
  //  // Populate the fields
  //  Message.populate(message, [{path: 'to', select: 'name photo'}, {
  //    path: 'from',
  //    select: 'name photo'
  //  }], function (err, m2) {
  //    if (err) {
  //      return handleError(res, err);
  //    }
  //    return res.json(201, m2);
  //  });
  //});
};

// Marks a message as read or unread
exports.mark = function (req, res) {
  Message.findById(req.params.id).populate('to', 'name photo').populate('from', 'name photo').exec(function (err, message) {
    if (err) {
      return handleError(res, err);
    }
    if (!message) {
      return res.send(404);
    }

    message.read = !!req.body.read;
    message.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, message);
    });
  });
};

// Deletes a message from the DB.
//exports.destroy = function(req, res) {
//  Message.findById(req.params.id, function (err, message) {
//    if(err) { return handleError(res, err); }
//    if(!message) { return res.send(404); }
//    message.remove(function(err) {
//      if(err) { return handleError(res, err); }
//      return res.send(204);
//    });
//  });
//};

function handleError(res, err) {
  return res.send(500, err);
}
