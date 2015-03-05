
var translations = require('../../config/translations');
var language = require('./language');

function getTranslation(code, key) {
  return translations[code] && translations[code][key]
}

/**
 * Returns the translation, falling back on the default translation. If no translation return the key
 * Three ways to call this:
 *
 * translate(req,  key)  --  Detect the language from the request
 * translate(user, key)  --  Use the user's preferences for the language
 * translate(lang, key)  --  Language is provided
 *
 * @param data
 * @param key
 * @returns {*}
 */
module.exports = function (data, key) {
  var locale = language.detect(data);
  return getTranslation(locale.code, key) ||
    getTranslation(locale.code.substr(0,2).toLowerCase(), key) ||
    getTranslation(language.defaultLocale.code, key) || key;
};
