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
 * Return text content of words in specified range.
 *
 * @param {Number} start - Starting index of range.
 * @param {Number} end - Final index of range.
 * @return {String} text content
 */
Words.prototype.getText = function getText(begin, end) {
  var words = this.slice(begin, end);
  var text = '';

  var len = words.length;
  for (var i = 0; i < len; i++)
    text += words[i].textContent + ' ';

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

/**
 * Returns word elements in specified range.
 *
 * @param {Number} start - Starting index of range.
 * @param {Number} end - Final index of range.
 * @return {Array}
 */
Words.prototype.slice = function range(begin, end) {
  return Array.prototype.slice.call(this.els, begin, end);
}

module.exports = Words;
