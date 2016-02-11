'use strict';

// TODO: enforce indices in bounds
const EventEmitter = require('events').EventEmitter;

/**
 * Represents a "selection" signified by that wrapped in a span.
 *
 * @param {HTMLElement} el - Element containing start of the selection.
 * @param {Words} words
 * @see words
 */
module.exports = class Selection extends EventEmitter {

  constructor(el, words) {
    super();

    const index = words.indexOf(el);

    this.initialIndex = index;
    this.currentIndex = index;
    this.previousIndex = index;

    this.words = words;

    this.wrapper = document.createElement('span');
    this.wrapper.className = 'ss-selection';
    el.parentNode.insertBefore(this.wrapper, el);

    // place marker spans
    this._updateWrapper();
  }

  get currentIndex() {
    return this._initialIndex;
  }

  set currentIndex(value) {
    if (value === -1)
      throw 'element not found';
    return this._initialIndex = value;
  }

  /**
   * Updates current selection.
   *
   * @param {HTMLElement} el
   */
  update(el) {
    this.previousIndex = this.currentIndex;
    this.currentIndex = this.words.indexOf(el);

    // if selection has actually changed adjust markers and run callbacks
    if (this.currentIndex !== this.previousIndex) {
      this._updateWrapper();
      // run callbacks
      this.emit('update');
    }
  }

  /**
   * Prevent selection from being modified.
   *
   * Note that DOM Manipulation only happens when current index changes.
   */
  finalize() {
    // Object.freeze(this);

    // run callbacks
    this.emit('finalize', this);

    // TODO: the following is insufficient
    // remove callbacks
    // this.events = {};
  }

  // FIXME: object freezing code doesn't work and is unnecessary
  // FIXME: callbacks are removed in finalize, but expected for onRemove

  /**
   * Remove this selection.
   */
  remove() {
    // if (!Object.isFrozen(this))
    //   throw 'Selection should be finalized before removed';

    const wrapper = this.wrapper;
    const parent = wrapper.parentNode;
    // childNodes is a live collection so need to make a copy
    const selectedWords = Array.prototype.slice.call(wrapper.childNodes);

    // move selected words out of wrapper
    selectedWords.forEach(word => parent.insertBefore(word, wrapper))

    // remove wrapper from DOM
    parent.removeChild(wrapper);
    // TODO: wrapper is frozen with the rest of the object so you can't delete it

    // run callbacks
    this.emit('remove', this);
  }

  // TODO: to what extent should a selection expose the selected elements?
  /**
   * Tests in selection contains provided DOM element.
   *
   * @param {DOMElement} el
   */
   contains(el) {
     const selectedWords = this.words.slice(this._begin(), this._end() + 1);
     return selectedWords.indexOf(el) !== -1;
   }

  /**
   * Returns text content of selection.
   *
   * @return {String}
   */
  toString() {
    const selectedWords = this.words.slice(this._begin(), this._end() + 1);
    const textArray = selectedWords.map(word => word.textContent);

    return textArray.join(' ');
  }

  /**
   * Add current selection to wrapper.
   *
   * @private
   */
  _updateWrapper() {
    const currentBegin = this._begin();
    const currentEnd = this._end();

    // calculate previous begin and end
    let previousBegin;
    let previousEnd;
    if (this.previousIndex < this.initialIndex) {
      previousBegin = this.previousIndex;
      previousEnd = this.initialIndex;
    } else {
      previousBegin = this.initialIndex;
      previousEnd = this.previousIndex;
    }

    // add current selection to wrapper
    const selectedWords = this.words.slice(currentBegin, currentEnd + 1);
    const wrapper = this.wrapper;
    selectedWords.forEach(word => wrapper.appendChild(word));

    // remove words no longer selected, adding them before or after the wrapper
    const parent = wrapper.parentNode;
    if (previousBegin < currentBegin) {
      // remove words from the start of the selection
      const removedWords = this.words.slice(previousBegin, currentBegin);
      // add words before the wrapper
      removedWords.forEach(word => parent.insertBefore(word, wrapper));
    } else if (currentEnd < previousEnd) {
      // remove words from the end of the selction
      const removedWords = this.words.slice(currentEnd + 1, previousEnd + 1);
      const nextSibling = this.wrapper.nextSibling;
      // add words after the wrapper, actually before its next sibling
      removedWords.forEach(word => parent.insertBefore(word, nextSibling));
    }
  }

  /**
   * Returns starting index of represented range.
   *
   * @private
   */
  _begin() {
    return Math.min(this.initialIndex, this.currentIndex);
  }

  /**
   * Returns ending index of represent range.
   *
   * @private
   */
  _end() {
    return Math.max(this.initialIndex, this.currentIndex);
  }
}
