
var translations = require('../../config/translations');
var language = require('./language');

module.exports = function (req, key) {

  // Return the translation, falling back on the default translation. If no translation return the key
  return translations[language.detectLang(req)][key] || translations[language.defaultLang][key] || key;
};
