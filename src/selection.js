var diff = require('./utils').diff;
var append = require('./utils').append;
var range = require('./utils').range;

/**
 * Manages model of selection. Communicates changes to instance of Words.
 *
 * @param {HTMLElement} el - Element containing start of the selection.
 * @param {Words} words
 * @see words
 */
function Selection(el, words) {
  var index = words.indexOf(el);

  this.startingIndex = index;
  this.previousIndex = index;
  this.currentIndex = index;

  this.words = words;
}

/**
 * Updates current index and pushes resulting changes to words.
 *
 * @param {HTMLElement} el
 */
Selection.prototype.updateIndex = function updateIndex(el) {
  var index = this.words.indexOf(el);

  this.previousIndex = this.currentIndex;
  this.currentIndex = index;

  this.words.toggleSelections(this.changedIndices());
}

/**
 * Returns indices of words whose selection status has changed since.
 *
 * @return {Array}
 * @private
 */
Selection.prototype.changedIndices = function changedIndices() {
  if (this.previousIndex === this.currentIndex) return [];

  var indices = [];

  var prevRange = range(this.startingIndex, this.previousIndex);
  var currRange = range(this.startingIndex, this.currentIndex);

  append(indices, diff(prevRange, currRange));
  append(indices, diff(currRange, prevRange));

  return indices;
}

/**
 * Returns text content of selection.
 *
 * @return {String}
 */
Selection.prototype.getText = function getText() {
  if (this.startingIndex < this.currentIndex) {
    return this.words.getText(this.startingIndex, this.currentIndex);
  } else {
    return this.words.getText(this.currentIndex, this.startingIndex);
  }
}

module.exports = Selection;
