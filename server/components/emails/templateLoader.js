/**
 * Created by josh on 2/16/15.
 */

var fs = require('fs');
var config = require('../../config/environment/index');

// Loads the email templates for a particular language
function loadEmails(lang) {
  var store = {};
  fs.readdirSync(__dirname + '/templates/' + lang).forEach(function (file) {
    var parts = file.split('.');
    var name = parts[0];
    store[name] = store[name] || {};
    store[name][parts[1]] = fs.readFileSync(__dirname + '/templates/' + lang + '/' + file, {
      encoding: 'utf8'
    });
  });
  return store;
}

var store = {};
fs.readdirSync(__dirname + '/templates').forEach(function (lang) {
  store[lang] = loadEmails(lang);
});

module.exports = function getTemplate(lang, name) {
  return store[lang] && store[lang][name];
};
