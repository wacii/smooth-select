var splitter = require('../src/splitter');

/**
 * Interface to underlying DOM element. Maintains selection state as classes.
 *
 * @constructor
 * @params {HTMLElement} el
 */
function Words(el) {
  this.els = splitter(el);
  this.selecting = false;
}

/**
 * Toggle selection state of words corresponding to provided indices.
 *
 * @param {Array} indices
 */
Words.prototype.toggleSelections = function toggleSelections(indices) {
  var len = indices.length;
  for (var i = 0; i < len; i++)
    this.els[indices[i]].classList.toggle('ss-selected');
}

/**
 * Return text content of words in specified range.
 *
 * @param {Number} start - Starting index of range.
 * @param {Number} end - Final index of range.
 * @return {String} text content
 */
Words.prototype.getText = function getText(start, end) {
  var text = '';
  for (var i = start; i <= end; i++)
    text += this.els[i].textContent + ' ';
  return text.trim();
}

/**
 * Return index of provided element in split words.
 *
 * @param {DOMElement} el
 * @return {Number} index of provided element or -1
 */
Words.prototype.indexOf = function indexOf(el) {
  return Array.prototype.indexOf.call(this.els, el);
}

module.exports = Words;
