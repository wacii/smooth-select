// TODO: enforce indices in bounds
// TODO: rename updateSelection to update
// TODO: rename getText to toString

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

  // remove listeners
  this.events = {};
}

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
 * Register one or more listeners for provided event.
 *
 * @param {string} name - The name of an event.
 * @param {...Function} callback
 */
Selection.prototype.on = function on(name, callback) {
  var handlers = this.events[name] || (this.events[name] = []);
  var callbacks = Array.prototype.slice.call(arguments, 1);
  Array.prototype.push.apply(handlers, callbacks);
};

/**
 * Removes listeners for a particular event.
 *
 * If a callback is provided, the corresponding listener is removed, if found.
 * Otherwise all listeners are removed for the specified event.
 *
 * @param {string} name - The name of an event.
 * @param {Function} callback
 */
Selection.prototype.off = function off(name, callback) {
  var handlers = this.events[name];

  // if there are no registered listeners nothing needs to be done
  if (handlers === undefined || handlers.length === 0) return;

  // if no callback supplied, remove all listeners
  if (callback === undefined)
    return handlers.splice(0, handlers.length);

  // remove supplied callback if found
  var index = handlers.indexOf(callback);
  if (index !== -1)
    handlers.splice(index, 1);
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
  // there is no insertAfter(), so insert before next sibling
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
