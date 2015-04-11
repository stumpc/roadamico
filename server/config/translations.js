module.exports = {
  en: {
    'service-unauthorized': 'Unauthorized. Not your service.',
    'no-user-created': 'No user created.',
    'access-granted': 'Access granted and email sent.',
    'no-open-registration': 'RoadAmico isn\'t allowing open registration yet.',
    'invalid-card-data': 'Invalid card data.',
    'no-user-found': 'No user found.',
    'email-not-blank': 'Email cannot be blank',
    'password-not-blank': 'Password cannot be blank',
    'email-in-use': 'The specified email address is already in use.',
    'invalid-password': 'Invalid password',
    'invalid-provider': 'Cannot follow. Invalid user id provided.',
    'already-booked': 'Cannot book. The time slot has been booked previously.',
    'avail-unauthorized': 'Unauthorized. You are not the booker of the time slot.',
    'rating-unauthorized': 'You are unauthorized to rate that booking.',

    // Email subjects
    'email.test':           'This is a test',
    'email.notification':   'RoadAmico Update',
    'email.message':        'RoadAmico: A message from {{name}}',
    'email.signup':         'Thank you for signing up with RoadAmico',
    'email.referral':       'Join your friends on RoadAmico',
    'email.grantAccess':    'Welcome to RoadAmico!',
    'email.resetPassword':  'RoadAmico Password Reset',
    'email.group.create':   'RoadAmico: A new group needs to be reviewed',

    // Notifications
    'notify.booked-booker': 'You have successfully booked {{service}} with {{provider}} at {{time}}.',
    'notify.booked-provider': 'You have been booked for {{service}} at {{time}} with {{booker}}.',
    'notify.canceled-booker': 'You have canceled {{service}} with {{provider}} at {{time}}.',
    'notify.canceled-provider': 'Your appointment for {{service}} at {{time}} with {{booker}} has been canceled.',

    'test': 'Hello world'
  },
  en_pirate: {
    'test': 'Arrg! Hello world mateys'
  },
  fr: {
    'service-unauthorized': 'Non autorisée. Ce n\'nest pas votre service.',

    test: 'Bonjour monde'
  },
  de: {
    test: 'Hallo welt'
  }
};
