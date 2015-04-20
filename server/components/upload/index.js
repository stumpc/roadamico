var cloudinary = require('cloudinary');
var fs = require('fs');
var Q = require('q');

module.exports = {
  image: function (img) {
    var deferred = Q.defer();

    if (process.env.NODE_ENV === 'test') {
      fs.unlinkSync(img.path);
      deferred.resolve(require('faker').image.imageUrl());
    } else {
      cloudinary.uploader.upload(img.path, function(result) {
        fs.unlinkSync(img.path); // Delete the file
        deferred.resolve(result.url);
      });
    }

    return deferred.promise;
  },

  file: function (file) {
    var deferred = Q.defer();

    if (process.env.NODE_ENV === 'test') {
      fs.unlinkSync(file.path);
      deferred.resolve(faker.image.imageUrl());
    } else {
      deferred.reject('File upload not implemented yet');
    }

    return deferred.promise;
  }
};
