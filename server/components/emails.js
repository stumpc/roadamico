/**
 * Created by josh on 2/16/15.
 */

var fs = require('fs');
var mustache = require('mustache');
var config = require('../config/environment');
var sendgrid = require('sendgrid');

var emails = {
  store: {},
  sendgrid: sendgrid(config.sendgrid.username, config.sendgrid.password)
};

// Pre-load the email templates
fs.readdirSync(__dirname + '/emails').forEach(function (file) {
  var parts = file.split('.');
  var name = parts[0];
  emails.store[name] = emails.store[name] || {};
  emails.store[name][parts[1]] = fs.readFileSync(__dirname + '/emails/' + file, {
    encoding: 'utf8'
  });
});

// A wrapper around the email payload in order to chain the send method
function Email(payload) {
  this.payload = payload;
  this.send = function (cb) {
    // If no callback is defined, then just log
    cb = cb || function (err, result) {
      if (err) {
        console.error('Error sending email', err);
      } else {
        console.log('Email sent', result);
      }
    };

    // Only actually send an email if in production mode
    if (process.env.NODE_ENV != 'production') {
      return cb(null, {message: '[fake] success'});
    }
    emails.sendgrid.send(payload, cb);
  };
}



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

  return new Email(data);
};

module.exports = emails;
