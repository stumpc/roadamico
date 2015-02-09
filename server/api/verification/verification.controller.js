
var User = require('../user/user.model');


exports.getUsersByStatus = function (status) {
  return function (req, res, next) {

    User.find({
      //verification: {
      'verification.status': status
      //}
    }, function (err, users) {
      if (err) return next(err);
      res.json(users);
    });
  };
};

exports.setStatus = function (status) {
  return function (req, res, next) {

    User.findById(req.params.id, function (err, user) {
      if (err) return next(err);
      if (!user) return res.send(401);

      // Set the verification status
      if (!user.verification) {
        user.verification = {status: status};
      } else {
        user.verification.status = status;
      }
      user.save(function (err, result) {
        if (err) return next(err);

        // TODO: Add message here when messages are implemented

        res.send(200);
      });
    })
  };
};
