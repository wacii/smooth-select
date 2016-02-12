'use strict';

const SELECTED = 'ss-selected';
const SELECTION = 'ss-selection';

const EventEmitter = require('events').EventEmitter;

function toggleSelected (word) {
  word.classList.toggle(SELECTED);
}

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

    this.isFinalized = false;

    const index = words.indexOf(el);

    this.initialIndex = index;
    this.currentIndex = index;
    this.previousIndex = index;

    this.words = words;

    el.classList.add(SELECTED);
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
    if (this.isFinalized) throw 'No updating selection once it is finalized';

    const currentIndex = this.currentIndex;
    const nextIndex = this.words.indexOf(el);

    if (currentIndex === nextIndex) return;
    this.currentIndex = nextIndex;

    const left = (currentIndex < nextIndex ? currentIndex : nextIndex);
    const right = (currentIndex < nextIndex ? nextIndex : currentIndex);
    const middle = [left, right, this.initialIndex].sort()[1];

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
    this.isFinalized = true;

    const span = document.createElement('span');
    span.className = SELECTION;

    const firstWord = this.selectedWords[0];
    firstWord.parentNode.insertBefore(span, firstWord);

    const fragment = document.createDocumentFragment();
    this.selectedWords.forEach(word => {
      word.classList.remove(SELECTED);
      fragment.appendChild(word);
    });
    span.appendChild(fragment);

    // run callbacks
    this.emit('finalize', this);
  }

  /**
   * Remove this selection.
   */
  remove() {
    if (!this.isFinalized) throw 'Finalize selection before removing it.';

    const wrapper = this.words[this.initialIndex].parentNode;
    if (!wrapper.classList.contains(SELECTION))
      throw 'Expected selection wrapper node';

    const fragment = document.createDocumentFragment();
    this.selectedWords.forEach(word => fragment.appendChild(word));

    const parent = wrapper.parentNode;
    parent.insertBefore(fragment, wrapper);
    parent.removeChild(wrapper);

    // run callbacks
    this.emit('remove', this);
  }

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
