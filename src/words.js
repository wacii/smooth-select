var splitter = require('../src/splitter');

/**
 * Interface to underlying DOM element. Maintains selection state as classes.
 *
 * @constructor
 * @params {HTMLElement} el
 */
function Words(el) {
  Array.prototype.push.apply(this, splitter(el));
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

Words.prototype.indexOf = Array.prototype.indexOf;
Words.prototype.slice = Array.prototype.slice;

module.exports = Words;
