'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var authTypes = ['github', 'twitter', 'facebook', 'google', 'linkedin'];
var moment = require('moment');

var UserSchema = new Schema({
  // Profile
  name: String,
  email: {type: String, lowercase: true},
  joined: String,
  phone: String,
  photo: String,
  location: String,
  bio: String,
  workplace: String,
  categories: [],

  // Privacy
  publicInfo: {
    phone: Boolean,
    location: Boolean,
    workplace: Boolean,
    email: Boolean
  },

  // Financial information
  financial: {
    cards: [{
      number: String, // Encrypted
      display: String, // ********1234
      exp: {
        month: Number,
        year: Number
      },
      cvc: String // Encrypted
    }]
  },

  // Only admin can set. These fields must be deleted in user.controller#update
  verification: {
    idUrl: String,
    status: String // none, pending, denied, approved
  },
  activated: Boolean,
  modCode: String,
  role: {
    type: String,
    default: 'user'
  },

  // Credentials
  pwResetBy: String,
  hashedPassword: String,
  provider: String,
  salt: String,
  facebook: {},
  twitter: {},
  google: {},
  github: {},
  linkedin: {}
});

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function () {
    var profile = {
      _id: this._id,
      name: this.name,
      email: this.email,
      joined: this.joined,
      phone: this.phone,
      photo: this.photo,
      location: this.location,
      bio: this.bio,
      workplace: this.workplace,
      categories: this.categories,
      verification: this.verification,
      activated: this.activated
    };

    // Add in public information
    if (this.publicInfo.email) {
      profile.email = this.email;
    }
    if (this.publicInfo.phone) {
      profile.phone = this.phone;
    }
    if (this.publicInfo.location) {
      profile.location = this.location;
    }
    if (this.publicInfo.workplace) {
      profile.workplace = this.workplace;
    }

    return profile;
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function () {
    return {
      '_id': this._id,
      'role': this.role,
      'activated': this.activated
    };
  });

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function (email) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function (hashedPassword) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return hashedPassword.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function (value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function (err, user) {
      if (err) throw err;
      if (user) {
        if (self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
  }, 'The specified email address is already in use.');

var validatePresenceOf = function (value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function (next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
      next(new Error('Invalid password'));
    else
      next();
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * 1. Account not activated
   * 2. Password change has been requested
   * 3. Passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function (plainText) {
    return !!((!this.activated && plainText === this.modCode) ||
      (this.encryptPassword(plainText) === this.hashedPassword) ||
      (this.modCode && this.pwResetBy && moment(this.pwResetBy).isAfter(moment()) && plainText === this.modCode));
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function () {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function (password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  },

  encrypt: function (value, password) {
    var cipher = crypto.createCipher('aes-256-cbc', password);
    var crypted = cipher.update(value, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  },

  decrypt: function (value, password) {
    var decipher = crypto.createDecipher('aes-256-cbc', password);
    var dec = decipher.update(value, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  },

  addCard: function (card, password) {
    card.number = String(card.number);
    card.cvc = String(card.cvc);

    var newCard = {
      number: this.encrypt(card.number, password),
      display: new Array(card.number.length - 3).join('*') + card.number.substr(card.number.length - 4, 4),
      exp: card.exp,
      cvc: this.encrypt(card.cvc, password)
    };

    if (!this.financial) {
      this.financial = {};
    }
    if (!this.financial.cards) {
      this.financial.cards = [];
    }
    this.financial.cards.push(newCard);
    return newCard;
  }
};

module.exports = mongoose.model('User', UserSchema);
