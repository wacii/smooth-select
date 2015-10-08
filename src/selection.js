// TODO: enforce indices in bounds

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
  this.previousIndex = index;

  this.words = words;

  // span marking the start of a selection
  this.beginSelection = document.createElement('span');
  this.beginSelection.className = 'ss-start-selection';

  // span marking the end of a selection
  this.endSelection = document.createElement('span');
  this.endSelection.className = 'ss-end-selection';

  // place marker spans
  this._updateWrapper();
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
 * Updates current selection.
 *
 * @param {HTMLElement} el
 */
Selection.prototype.updateSelection = function updateIndex(el) {
  this.previousIndex = this.currentIndex;
  this.currentIndex = this.words.indexOf(el);

  if (this.currentIndex !== this.previousIndex)
    this._updateWrapper();
};

/**
 * Returns text content of selection.
 *
 * @return {String}
 */
Selection.prototype.getText = function getText() {
  var selectedWords = this.words.slice(this._begin(), this._end() + 1);
  var textArray = [];

  var len = selectedWords.length
  for (var i = 0; i < len; i++)
    textArray.push(selectedWords[i].textContent)

  return textArray.join(' ');
};

/**
 * Add current selection to wrapper.
 *
 * @private
 */
Selection.prototype._updateWrapper = function updateWrapper() {
  var word = this.words[this._begin()];
  word.parentNode.insertBefore(this.beginSelection, word);

  word = this.words[this._end()];
  word.parentNode.insertBefore(this.endSelection, word.nextSibling);
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
 * Returns ending index of represent range.
 *
 * @private
 */
Selection.prototype._end = function _end() {
  return Math.max(this.initialIndex, this.currentIndex);
}

module.exports = Selection;
