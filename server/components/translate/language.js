/**
 * Created by josh on 3/4/15.
 */

var locale = require('locale');
var translations = require('../../config/translations');
var supported = new locale.Locales(Object.keys(translations));
var defaultLang = locale.Locale.default.code;


exports.defaultLang = defaultLang;

exports.detectLang = function (req) {
  // Allow for passing in the user instead
  if (req._id && req.name) {
    req = {
      user: req
    };
  }

  // Determine which language to use
  var lang = defaultLang;
  if (req.user && req.user.languages && req.user.languages.length) {
    lang = req.user.languages[0].substr(0,2).toLowerCase();
  } else if (req.headers) {
    lang = req.headers['accept-language'] || defaultLang;
  }
  return new locale.Locales(lang).best(supported).code;
};
