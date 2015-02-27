exports.unique = function (str) {
  var modified = str.charAt(0);
  for (var i = 1; i < str.length; i++) {
    if (str.charAt(i) !== str.charAt(i-1)) {
      modified += str.charAt(i);
    }
  }
  return modified;
};

exports.removeSpaces = function (str) {
  return str.replace(/\s/g, '');
};

exports.removeVowels = function (str) {
  return str.replace(/[aåáàâäãeéèêëiíìîïoóòôöõuúùûüyÿ]/ig, '');
};

exports.unifyVowels = function (str) {
  return str.replace(/[aåáàâäãeéèêëiíìîïoóòôöõuúùûüyÿ]/ig, 'a');
};
