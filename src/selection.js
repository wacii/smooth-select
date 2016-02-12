'use strict';

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

    el.classList.add('ss-selected');
  }

  get selectedWords() {
    const initialIndex = this.initialIndex;
    const currentIndex = this.currentIndex;

    const start = (currentIndex < initialIndex ? currentIndex : initialIndex);
    const final = (currentIndex < initialIndex ? initialIndex : currentIndex);

    return this.words.slice(start, final + 1);
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
    const currentIndex = this.currentIndex;
    const nextIndex = this.words.indexOf(el);

    if (currentIndex === nextIndex) return;
    this.currentIndex = nextIndex;

    const left = (currentIndex < nextIndex ? currentIndex : nextIndex);
    const right = (currentIndex < nextIndex ? nextIndex : currentIndex);
    const middle = [left, right, this.initialIndex].sort()[1];
    const toggleSelected = word => word.classList.toggle('ss-selected');

    this.words.slice(left, middle).forEach(toggleSelected);
    this.words.slice(middle + 1, right + 1).forEach(toggleSelected);

    // run callbacks
    this.emit('update');
  }

  /**
   * Prevent selection from being modified.
   *
   * Note that DOM Manipulation only happens when current index changes.
   */
  finalize() {
    // Object.freeze(this);

    const span = document.createElement('span');
    span.className = 'ss-selection';

    const firstWord = this.selectedWords[0];
    firstWord.parentNode.insertBefore(span, firstWord);

    const fragment = document.createDocumentFragment();
    this.selectedWords.forEach(word => {
      word.classList.remove('ss-selected');
      fragment.appendChild(word);
    });
    span.appendChild(fragment);

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

    // const wrapper = this.wrapper;
    // const parent = wrapper.parentNode;
    // // childNodes is a live collection so need to make a copy
    // const selectedWords = Array.prototype.slice.call(wrapper.childNodes);
    //
    // // move selected words out of wrapper
    // selectedWords.forEach(word => parent.insertBefore(word, wrapper))
    //
    // // remove wrapper from DOM
    // parent.removeChild(wrapper);
    // // TODO: wrapper is frozen with the rest of the object so you can't delete it

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
     return this.selectedWords.indexOf(el) !== -1;
   }


  /**
   * Returns text content of selection.
   *
   * @return {String}
   */
  toString() {
    return this.selectedWords.map(word => word.textContent).join(' ');
  }
}
