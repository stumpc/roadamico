/**
 * Created by josh on 3/4/15.
 */

// If no default lang is defined in the ENV then make it english (ie. running tests in CI)
if (!process.env.LANG) {
  process.env.LANG = 'en';
}

var locale = require('locale');
var translations = require('../../config/translations');
var supported = new locale.Locales(Object.keys(translations));
var defaultLocale = locale.Locale.default;

function localeMatch(lang) {
  return new locale.Locales(lang).best(supported);
}

function getUserLocale(user) {
  var lang = user && user.languages && user.languages[0];
  return lang && localeMatch(lang);
}

function getRequestLocale(req) {
  var lang = req.headers['accept-language'];
  return lang && localeMatch(lang);
}

function detect(data) {
  var locale;
  // Try to get the locale from the user
  if (data._id) {
    locale = getUserLocale(data);
  }

  // If that didn't return anything, then try to get the locale from the request
  if (!locale && data.headers) {

    // Use the user in the request
    if (data.user && data.user._id) {
      locale = getUserLocale(data.user);
    }
    // Use the request headers
    if (!locale) {
      locale = getRequestLocale(data);
    }
  }

  // If that didn't work, check if it's a string
  if (!locale && typeof data === 'string') {
    locale = localeMatch(data);
  }

  // Otherwise, fallback to the default locale
  if (!locale) {
    locale = defaultLocale;
  }

  return locale;
}

exports.defaultLocale     = defaultLocale;
exports.localeMatch       = localeMatch;
exports.getUserLocale     = getUserLocale;
exports.getRequestLocale  = getRequestLocale;
exports.detect            = detect;
