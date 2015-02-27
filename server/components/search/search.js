
var _ = require('lodash');
var curves = require('./curves');
var gcdist = require('./greatCircleDist');

var natural = require('natural');
//var txtproc = require('./textProcessor');
//var levenshtein = require('./levenshtein');

function SearchSession(searchParams) {
  this.params = _.extend({
    magnitude: 100,     // Sets some reference frame
    threshold: 15,      // Items that match less than 15% will not be included

    distance: {
      limit: 50,        // Only consider items within 50 KM
      weight: 'linear'  // Weighting curve
    },

    // TODO: Possibly have different search parameters for different locales
    text: {
      weight: 'parabolic',
      distAlg: 'jaro-winkler'  // jaro-winkler, levenshtein, or
      //unique: true ,    // Remove duplicate subsequent letters
      //tokenSeparator: '\\s+',
      //vowels: 'unify'   // unify, remove, or none
    }
  }, searchParams);
}

SearchSession.prototype = {
  scoreDist: function (pos1, pos2) {
    var dist = gcdist(pos1[0], pos1[1], pos2[0], pos2[1]);
    var rawScore = Math.max(this.params.distance.limit - Math.abs(dist), 0);
    var scaled = rawScore / this.params.distance.limit;
    return curves[this.params.distance.weight](scaled) * this.params.magnitude;
  },

  scoreText: function (text1, text2) {
    text1 = text1.toLowerCase();
    text2 = text2.toLowerCase();
    var score = natural.JaroWinklerDistance(text1, text2);
    return curves[this.params.text.weight](score) * this.params.magnitude;
  },

  finalize: function (scoreMap) {
    var _this = this;
    return _(Object.keys(scoreMap))
      .map(function (id) {
        return {
          id: id,
          score: scoreMap[id]
        };
      })
      .filter(function (result) {
        return result.score >= _this.params.threshold;
      })
      .sortBy('score').value().reverse();
  }

  //scoreText: function (text1, text2) {
  //  // Preprocess text to try to remove minor differences
  //  text1 = text1.toLowerCase();
  //  text2 = text2.toLowerCase();
  //  if (this.params.text.vowels === 'unify') {
  //    text1 = txtproc.unifyVowels(text1);
  //    text2 = txtproc.unifyVowels(text2);
  //  }
  //  if (this.params.text.vowels === 'remove') {
  //    text1 = txtproc.removeVowels(text1);
  //    text2 = txtproc.removeVowels(text2);
  //  }
  //  if (this.params.text.unique) {
  //    text1 = txtproc.unique(text1);
  //    text2 = txtproc.unique(text2);
  //  }
  //
  //  // Generate tokens
  //  var separator = new RegExp(this.params.text.tokenSeparator);
  //  var tokens1 = text1.split(separator);
  //  var tokens2 = text1.split(separator);
  //
  //  // Compute edit distance
  //  var dist = levenshtein(text1, text2);
  //  var scaled = 1 - dist / Math.max(text1.length, text2.length);
  //  //console.log('text score [debug]', text1, text2, dist, scaled);
  //  return curves[this.params.text.weight](scaled) * this.params.magnitude;
  //}
};

module.exports = SearchSession;
