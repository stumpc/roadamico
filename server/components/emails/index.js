
var language = require('../translate/language');
var templateLoader = require('./templateLoader');
var translate = require('../translate');
var mustache = require('mustache');
var config = require('../../config/environment/index');
var sendgrid = require('sendgrid')(config.sendgrid.username, config.sendgrid.password);

/*
  What this does:
  Determine the language
  Determines the email subject
  TODO: Determines if we should send the email based on preferences
  Builds and sends the email
 */

function buildEmail(data) {
  data.view = data.view || {};
  data.email = data.email || (data.user && data.user.email) || (data.req && data.req.user && data.req.user.email);

  var email = {
    from: config.email.adminEmail,
    fromName: config.email.adminName,
    to: data.email
  };

  // Load the subject
  var subject = translate(data.req || data.user, 'email.' + data.name);
  email.subject = mustache.render(subject, data.view);

  // Load the email body
  // TODO: Have a standard template
  // TODO: Add in tracking stuff
  var template = templateLoader(language.detectLang(data.req), data.name) || templateLoader(language.defaultLang, data.name);
  if (template.txt) {
    email.text = mustache.render(template.txt, data.view);
  }
  if (template.html) {
    email.html = mustache.render(template.html, data.view);
  }

  return email;
}

module.exports = function (data) {
  var email = buildEmail(data);

  // If no callback is defined, then just log
  var callback = data.cb || function (err, result) {
    if (err) {
      console.error('Error sending email', err);
    } else {
      console.log('Email sent', result);
    }
  };

  // Only actually send an email if in production mode
  if (process.env.NODE_ENV !== 'production') {
    return callback(null, {message: '[fake]' + email.subject + ': "' + email.text + '"'});
  }
  sendgrid.send(email, callback);
};
