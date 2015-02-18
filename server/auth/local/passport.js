var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function (User, config) {
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password' // this is the virtual field on the model
    },
    function(email, password, done) {
      User.findOne({
        email: email.toLowerCase()
      }, function(err, user) {
        if (err) return done(err);

        if (!user) {

          // A user can also use their ID instead of email
          User.findById(email, function (err, user) {
            if (err || !user) return done(null, false, { message: 'This email is not registered.' });

            if (!user.authenticate(password)) {
              return done(null, false, {message: 'This password is not correct.'});
            }
            return done(null, user);
          });
        } else {

          if (!user.authenticate(password)) {
            return done(null, false, {message: 'This password is not correct.'});
          }
          return done(null, user);
        }
      });
    }
  ));
};
