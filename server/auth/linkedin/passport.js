var passport = require('passport');
var LinkedInStrategy = require('passport-linkedin').Strategy;
var moment = require('moment');
var config = require('../../config/environment');
var genCode = require('../../components/genCode');

exports.setup = function (User, config) {
  passport.use(new LinkedInStrategy({
      consumerKey: config.linkedin.clientID,
      consumerSecret: config.linkedin.clientSecret,
      callbackURL: config.linkedin.callbackURL
    },
    function(token, tokenSecret, profile, done) {
      User.findOne({
          'linkedin.id': profile.id
        },
        function(err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            if (!config.appLive) return done(null, {});

            user = new User({
              name: profile.displayName,
              //email: profile.emails[0].value,
              role: 'user',
              provider: 'linkedin',
              linkedin: profile._json,
              joined: moment().toISOString(),
              modCode: genCode(),
              emailPrefs: config.userSettings.emailPrefs
            });
            user.save(function(err) {
              if (err) done(err);
              return done(err, user);
            });
          } else {
            return done(err, user);
          }
        });
    }
  ));
};
