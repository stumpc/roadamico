'use strict';

// Put shared translations here
angular.module('roadAmicoApp')
  .config(function ($translateProvider) {

    $translateProvider.translations('en', {
      // Common form elements
      Save: 'Save',
      Cancel: 'Cancel',
      Change: 'Change',
      Password: 'Password',
      'password-again': 'Re-enter Password',
      Name: 'Name',
      Email: 'Email',
      Timezone: 'Timezone',
      Languages: 'Languages',
      Login: 'Login',
      Register: 'Register',
      'phone-number': 'Phone Number',
      Location: 'Location',
      Workplace: 'Workplace',
      Bio: 'Bio',
      Verified: 'Verified',
      Rate: 'Rate',
      Services: 'Services',
      Sort: 'Sort',
      Time: 'Time',
      Duration: 'Duration',
      Cost: 'Cost',
      Notes: 'Notes',
      Booked: 'Booked',
      Available: 'Available',
      Book: 'Book',

      // Social login
      'connect-facebook': 'Connect with Facebook',
      'connect-google': 'Connect with Google+',
      'connect-twitter': 'Connect with Twitter',
      'connect-linkedin': 'Connect with LinkedIn',

      // Help messages
      'name-required': 'Your name is required.',
      'timezone-required': 'A timezone is required.',
      'password-length': 'Password must be at least 8 characters long.',
      'password-match': 'Passwords must match.',
      'password-required': 'Password is required.',
      'email-and-password': 'Please enter your email and password.',
      'valid-email': 'Please enter a valid email.',
      'what-email': 'What\'s your email address?',
      'invalid-password': 'Invalid Password',
      'password-changed': 'Password successfully changed.',

      // Months
      January: 'January',
      February: 'February',
      March: 'March',
      April: 'April',
      May: 'May',
      June: 'June',
      July: 'July',
      August: 'August',
      September: 'September',
      October: 'October',
      November: 'November',
      December: 'December'
    });
    $translateProvider.translations('fr', {
      Save: 'Enregistrer',
      Cancel: 'Annuler',
      Password: 'Mot de Passe',
      Name: 'Nom',
      Email: 'Email',
      Timezone: 'Fuseau Horaire',
      Languages: 'Langues'

    });
  });
