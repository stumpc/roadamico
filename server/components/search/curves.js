// Note: these are unit curves. That is, they expect x to be in the range [0, 1]
// Scale
module.exports = {

  /**
   * Linear: for equal weighting
   *
   * @param x
   * @returns {*}
   */
  linear: function (x) {
    return x;
  },

  /**
   * Parabolic: For sharp cutoff
   *
   * @param x
   * @returns {number}
   */
  parabolic: function (x) {
    return x*x;
  },

  /**
   * Inverse parabolic: For slow cutoff
   *
   * @param x
   * @returns {number}
   */
  inverse: function (x) {
    return Math.sqrt(x);
  }
};
