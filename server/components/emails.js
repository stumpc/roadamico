/**
 * Created by josh on 2/16/15.
 */

var fs = require('fs');
var mustache = require('mustache');
var config = require('../config/environment');
var sendgrid = require('sendgrid');
var basepath = require('path').dirname(process.mainModule.filename);

var emails = {
  store: {},
  sendgrid: sendgrid(config.sendgrid.username, config.sendgrid.password)
};

// Pre-load the email templates
fs.readdirSync(basepath + '/components/emails').forEach(function (file) {
  var parts = file.split('.');
  var name = parts[0];
  emails.store[name] = emails.store[name] || {};
  emails.store[name][parts[1]] = fs.readFileSync(basepath + '/components/emails/' + file, {
    encoding: 'utf8'
  });
});

emails.create = function (name, data, view) {
  // Email contents
  if (emails.store[name] && emails.store[name].txt) {
    data.text = mustache.render(emails.store[name].txt, view);
  }
  if (emails.store[name] && emails.store[name].html) {
    data.html = mustache.render(emails.store[name].html, view);
  }

  // Other settings
  data.from = data.from || config.email.adminEmail;
  data.fromname = data.fromname || config.email.adminName;

  return data;
};

module.exports = emails;
