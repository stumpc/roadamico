/**
 * Created by josh on 2/6/15.
 *
 * Configures the cloudinary api.
 */

var cloudinary = require('cloudinary');
var config = require('./environment');

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key:    config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret
});
