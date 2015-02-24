/**
 * Created by josh on 2/24/15.
 */

var User = require('../api/user/user.model');
var emails = require('./emails');

exports.notify = function (id, notification) {

  // TODO: Implement this
  console.log('TODO: Notification');

};

exports.message = function (to, from, message) {
  try {
    User.findById(to, function (err, toUser) {
      if (err) { throw err; }

      User.findById(from, function (err, fromUser) {
        if (err) { throw err; }

        var subject = 'RoadAmico: ' + fromUser.name + ' has messaged you';
        emails.create('message', {
          to: toUser.email,
          subject: subject
        }, {
          name: fromUser.name,
          message: message
        }).send();
      });
    });
  } catch (e) {
    console.error('Couldn\'t create message.', e);
  }
};
