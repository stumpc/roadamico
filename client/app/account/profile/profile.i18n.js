'use strict';

angular.module('roadAmicoApp')
  .config(function ($translateProvider) {
    $translateProvider.translations('en', {
      'change-picture': 'Change picture',
      'view-profile': 'View public profile',
      'personal-info': 'Personal Information',
      'Privacy': 'Privacy',
      'privacy-instructions': 'Select which pieces of information you would like to make public:',

      // Verification
      'account-status': 'Account status:',
      'verification-denied': 'Verification Denied',
      'verification-pending': 'Verification Pending',
      'not-verified': 'Not Verified',
      'account-verification': 'Account Verification',
      'account-is-verified': 'Your account has been verified.',
      'account-is-denied': 'Your request has been denied. This may be due to an illegible photo or an invalid ID. Please check your messages for more details.',
      'account-is-pending': 'The moderation staff has been notified of your request. You will be notified when your request has been processed.',
      'verification-overview': 'By verifying your account by submitting a valid government-issued photo ID, other users will know that you are real and trustworthy.',
      'verification-process': 'To begin the process of verifying your account, please upload a clear picture of photo ID validating your identity. Once you have submitted your picture, our moderation staff will verify it and either approve or deny your request. You will be notified when this occurs.',
      'choose-file': 'Choose File',

      // Financial information
      'financial-information': 'Financial Information',
      'saved-cards': 'Saved Cards:',
      'card-expiration-short': 'Exp:',
      'no-cards': 'You currently don\'t have any cards saved.',
      'add-card': 'Add Card',
      'card-number': 'Card Number',
      'card-number-required': 'Card number is required.',
      'Expiration': 'Expiration',
      'card-exp-required': 'Card expiration month is required.',
      CVC: 'CVC',
      'cvc-required': 'CVC is required.',
      'card-security-note': 'Your privacy is important to us. Your financial information is saved using industrial-strength encryption. That means that only you can view it. Nobody else—not even us.'
    });
  });
