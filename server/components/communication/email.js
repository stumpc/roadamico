var mustache = require('mustache');
var templateLoader = require('./templateLoader');
var language = require('../translate/language');
var translate = require('../translate');
var config = require('../../config/environment');
var sendgrid = require('sendgrid')(config.sendgrid.username, config.sendgrid.password);


module.exports = function (name, data) {
  data.email = data.email || (data.user && data.user.email);
  if (!data.email) {
    console.error('No email address provided to send "' + name + '" email.');
    return;
  }

  var lang = language.normalize(language.detect(data.user || data.req || {}).code);
  var emailPayload = {
    from:     config.email.adminEmail,
    fromName: config.email.adminName,
    to:       data.email,
    subject:  mustache.render(translate(lang, 'email.' + name), data.view)
  };

  // Load the email body
  var template = templateLoader(lang, name) || templateLoader(language.defaultLocale.code, name);
  if (!template) {
    console.error('Error: No template found for ' + name + '[' + lang + ']');
    return;
  }
  if (template.txt) {
    emailPayload.text = mustache.render(template.txt, data.view);
  }
  if (template.html) {
    emailPayload.html = mustache.render(template.html, data.view);
  }

  // TODO: Have a standard template
  // TODO: Add in tracking stuff

  // Only actually send an email if in production mode
  if (process.env.NODE_ENV !== 'production') {
    console.log('-- Fake email sent --');
    console.log('[' + emailPayload.subject + ']');
    console.log(emailPayload.text);
  } else {
    sendgrid.send(emailPayload, function (err, data) {
      if (err) {
        console.error('Error sending email', err);
      } else {
        console.log('Email sent', result);
      }
    });
  }
};
