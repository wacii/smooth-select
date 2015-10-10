// TODO: enforce indices in bounds
var events = require('./events')

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

  // store handlers for various events
  this.events = {};

  this.wrapper = document.createElement('span');
  this.wrapper.className = 'ss-selection';
  el.parentNode.insertBefore(this.wrapper, el);

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
Selection.prototype.update = function updateIndex(el) {
  this.previousIndex = this.currentIndex;
  this.currentIndex = this.words.indexOf(el);

  // if selection has actually changed adjust markers and run callbacks
  if (this.currentIndex !== this.previousIndex) {
    this._updateWrapper();

    // run update callbacks
    var handlers = this.events['update'] || [];
    var len = handlers.length;
    for (var i = 0; i < len; i++)
      handlers[i].call(this);
  }
};

/**
 * Prevent selection from being modified.
 *
 * Note that DOM Manipulation only happens when current index changes.
 */
Selection.prototype.finalize = function finalize() {
  Object.freeze(this);

  // run finalize callbacks
  var handlers = this.events['finalize'] || [];
  var len = handlers.length;
  for (var i = 0; i < len; i++)
    handlers[i].call(this);

  // remove callbacks
  this.events = {};
}

/**
 * Remove this selection.
 */
Selection.prototype.remove = function remove() {
  if (!Object.isFrozen(this))
    throw 'Selection should be finalized before removed';

  var wrapper = this.wrapper;
  var parent = wrapper.parentNode;
  // childNodes is a live collection so need to make a copy
  var selectedWords = Array.prototype.slice.call(wrapper.childNodes);

  // move selected words out of wrapper
  var len = selectedWords.length;
  for (var i = 0; i < len; i++)
    parent.insertBefore(selectedWords[i], wrapper);

  // remove wrapper from DOM
  parent.removeChild(wrapper);
  // TODO: wrapper is frozen with the rest of the object so you can't delete it

  // run callbacks
  var handlers = this.events['remove'] || [];
  var len = handlers.length;
  for (i = 0; i < len; i++)
    handlers[i].call(this);
}

// TODO: to what extent should a selection expose the selected elements?
/**
 * Tests in selection contains provided DOM element.
 *
 * @param {DOMElement} el
 */
 Selection.prototype.contains = function contains(el) {
   var selectedWords = this.words.slice(this._begin(), this._end() + 1);
   return selectedWords.indexOf(el) !== -1;
 }

/**
 * Returns text content of selection.
 *
 * @return {String}
 */
Selection.prototype.toString = function toString() {
  var selectedWords = this.words.slice(this._begin(), this._end() + 1);
  var textArray = [];

  var len = selectedWords.length
  for (var i = 0; i < len; i++)
    textArray.push(selectedWords[i].textContent)

  return textArray.join(' ');
};

/**
 * Register event callbacks.
 *
 * @see events.on
 */
Selection.prototype.on = events.on;

/**
 * Remove event callbacks.
 *
 * @see events.on
 */
Selection.prototype.off = events.off;

/**
 * Add current selection to wrapper.
 *
 * @private
 */
Selection.prototype._updateWrapper = function updateWrapper() {
  var currentBegin = this._begin();
  var currentEnd = this._end();

  // calculate previous begin and end
  var previousBegin, previousEnd;
  if (this.previousIndex < this.initialIndex) {
    previousBegin = this.previousIndex;
    previousEnd = this.initialIndex;
  } else {
    previousBegin = this.initialIndex;
    previousEnd = this.previousIndex;
  }

  // add current selection to wrapper
  var selectedWords = this.words.slice(currentBegin, currentEnd + 1);

  var len = selectedWords.length;
  for (var i = 0; i < len; i++)
    this.wrapper.appendChild(selectedWords[i]);

  // remove words no longer selected, adding them before or after the wrapper
  var removedWords, parent, nextSibling;
  if (previousBegin < currentBegin) {
    // remove words from the start of the selection
    removedWords = this.words.slice(previousBegin, currentBegin);
    parent = this.wrapper.parentNode;

    // add words before the wrapper
    var len = removedWords.length;
    for (i = 0; i < len; i++)
      parent.insertBefore(removedWords[i], this.wrapper);
  } else if (currentEnd < previousEnd) {
    // remove words from the end of the selction
    removedWords = this.words.slice(currentEnd + 1, previousEnd + 1);
    parent = this.wrapper.parentNode;
    nextSibling = this.wrapper.nextSibling;

    // add words after the wrapper, actually before its next sibling
    var len = removedWords.length;
    for (i = 0; i < len; i++)
      parent.insertBefore(removedWords[i], nextSibling);
  }
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
