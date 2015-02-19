/**
 * Creates a random string. To be used when creating modCodes
 * @returns {string}
 */
module.exports = function genCode() {
  var s = Math.random().toString(36).slice(2);
  return s.length === 16 ? s : genCode();
};
