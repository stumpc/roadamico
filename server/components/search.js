

// From https://github.com/mwgg/GreatCircle/blob/master/GreatCircle.js
function validateRadius(unit) {
  var r = {'KM': 6371.009, 'MI': 3958.761, 'NM': 3440.070, 'YD': 6967420, 'FT': 20902260};
  return r[unit] || unit;
}
function greatCircleDist(lat1, lon1, lat2, lon2, unit) {
  unit = unit || 'KM';
  var r = validateRadius(unit);
  lat1 *= Math.PI / 180;
  lon1 *= Math.PI / 180;
  lat2 *= Math.PI / 180;
  lon2 *= Math.PI / 180;
  var lonDelta = lon2 - lon1;
  var a = Math.pow(Math.cos(lat2) * Math.sin(lonDelta) , 2) + Math.pow(Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lonDelta) , 2);
  var b = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lonDelta);
  var angle = Math.atan2(Math.sqrt(a) , b);
  return angle * r;
}

// From http://en.wikibooks.org/wiki/Algorithm_Implementation/Strings/Levenshtein_distance#JavaScript
// Compute the edit distance between the two given strings
function getEditDistance(a, b) {
  if(a.length === 0) return b.length;
  if(b.length === 0) return a.length;

  var matrix = [];

  // increment along the first column of each row
  var i;
  for(i = 0; i <= b.length; i++){
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for(j = 0; j <= a.length; j++){
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for(i = 1; i <= b.length; i++){
    for(j = 1; j <= a.length; j++){
      if(b.charAt(i-1) == a.charAt(j-1)){
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
          Math.min(matrix[i][j-1] + 1, // insertion
            matrix[i-1][j] + 1)); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
}

var curves = {
  linear: function (x) {
    return x;
  },
  parabolic: function (x, mag) {
    x /= mag;
    return (x*x) * mag;
  },
  inverse: function (x, mag) {
    x /= mag;
    return (1 - x*x) * mag;
  }
};

function SearchSession(searchParams) {
  this.params = _.extend({
    magnitude: 100,     // Sets some reference frame
    threshold: 10,      // Items that match less than 10% will not be included

    distance: {
      limit: 50,        // Only consider items within 50 KM
      weight: 'linear'  // Weighting curve
    },

    // TODO: Possibly have different search parameters for different locales
    text: {
      weight: 'linear',
      spaces: 'remove', // remove, single, or none
      vowels: 'single', // remove, single, unify, or none
      conson: 'single'  // remove, single, unify, or none
    }
  }, searchParams);
}

SearchSession.prototype = {
  scoreDist: function (lat1, lon1, lat2, lon2) {
    var dist = greatCircleDist(lat1, lon1, lat2, lon2);
    var rawScore = Math.max(this.params.distance.limit - Math.abs(dist), 0);
    return curves[this.params.distance.weight](rawScore, this.params.distance.limit);
  },
  scoreText: function (text1, text2) {
    // Preprocess
    // - remove spaces
    // - remove/unify vowels
    // - remove duplicate letters

  }
};
