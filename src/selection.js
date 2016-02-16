'use strict';

// TODO: document, note assumptions regarding input/output

const SELECTED = 'ss-selected';
const SELECTION = 'ss-selection';

const range = require('./utils/range');
const xor = require('./utils/xor');
const wrap = require('./utils/wrap');
const unwrap = require('./utils/unwrap');

/**
 * A selection as a group of contiguous nodes, each assumed to be a word.
 *
 * @param {HTMLElement} el - Element containing start of the selection.
 * @param {Words} words
 * @see words
 */
module.exports = class Selection {

  constructor(el, words) {
    this.isFinalized = false;
    this.wrapper = null;

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

    const nextIndex = this.words.indexOf(el);
    if (this.currentIndex === nextIndex) return;

    // words in only one of the two ranges, initial..current and initial..next
    xor(this.words, this.initialIndex, this.currentIndex, nextIndex)
      .forEach(word => word.classList.toggle(SELECTED));

    this.currentIndex = nextIndex;
  }

  /**
   * Prevent selection from being modified.
   */
  finalize() {
    this.isFinalized = true;

    const span = document.createElement('span');
    span.className = SELECTION;

    this.selectedWords.forEach(word => word.classList.remove(SELECTED));
    wrap(span, this.selectedWords);

    this.wrapper = span;
  }

  /**
   * Remove this selection.
   */
  remove() {
    if (!this.isFinalized) throw 'Finalize selection before removing it.';
    unwrap(this.wrapper);
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

  wordsBetween(el) {
    const index = this.words.indexOf(el);
    return range(index, this.currentIndex).map(i => this.words[i]);
  }
}
