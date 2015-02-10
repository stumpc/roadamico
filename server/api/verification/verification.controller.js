
var User = require('../user/user.model');
var cloudinary = require('cloudinary');
var fs = require('fs');


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

exports.submit = function (req, res, next) {

  var img = req.files.file;
  cloudinary.uploader.upload(img.path, function(result) {
    fs.unlinkSync(img.path); // Delete the file

    // Save the user
    req.user.verification = {
      status: 'pending',
      idUrl: result.url
    };

    // TODO: Send a notification to the admins

    req.user.save(function (err, user) {
      if (err) return next(err);
      res.send(user.verification);
    });
  });

};
