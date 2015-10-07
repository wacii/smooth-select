// TODO: move from wrapper to two sets of marker spans flanking content

/**
 * Represents a "selection" signified by that wrapped in a span.
 *
 * @param {HTMLElement} el - Element containing start of the selection.
 * @param {Words} words
 * @see words
 */
function Selection(el, words) {
  var index = words.indexOf(el);

  this.initialIndex = index;
  this.currentIndex = index;

  this.words = words;

  // TODO: replace fake
  this.wrapper = { appendChild: function() {} };

  this.updateWrapper();
}

Object.defineProperty(Selection.prototype, 'currentIndex', {
  get: function() {
    return this._initialIndex;
  },
  set: function(value) {
    if (value === -1)
      throw 'element not found';
    return this._initialIndex = value;
  }
});

/**
 * Add current selection to wrapper.
 */
Selection.prototype.updateWrapper = function updateWrapper() {
  var selectedWords = this.words.slice(this._begin(), this._end());

  var len = selectedWords.length;
  for (var i = 0; i < len; i++)
    this.wrapper.appendChild(selectedWords[0]);
};

/**
 * Updates current selection.
 *
 * @param {HTMLElement} el
 */
Selection.prototype.updateIndex = function updateIndex(el) {
  this.currentIndex = this.words.indexOf(el);
  this.updateWrapper();
};

/**
 * Returns text content of selection.
 *
 * @return {String}
 */
Selection.prototype.getText = function getText() {
  return this.words.getText(this._begin(), this._end());
};

/**
 * Returns starting index of represented range.
 *
 * @private
 */
Selection.prototype._begin = function _begin() {
  return Math.min(this.initialIndex, this.currentIndex);
}

/**
 * Returns ending index of represent range, plus one.
 *
 * The plus one is because the end parameter in slice is exclusive.
 * @private
 */
Selection.prototype._end = function _end() {
  return Math.max(this.initialIndex, this.currentIndex) + 1;
}

module.exports = Selection;
