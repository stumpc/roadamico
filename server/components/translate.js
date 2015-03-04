
var locale = require('locale');
var translations = require('../config/translations');
var supported = new locale.Locales(Object.keys(translations));
var defaultLang = locale.Locale.default.code;

module.exports = function (req, key) {

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
  } else {
    lang = req.headers['accept-language'];
  }
  var best = new locale.Locales(lang).best(supported).code;

  // Return the translation, falling back on the default translation. If no translation return the key
  return translations[best][key] || translations[defaultLang][key] || key;
};
