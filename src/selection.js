'use strict';

// TODO: document, note assumptions regarding input/output

const SELECTED = 'ss-selected';
const SELECTION = 'ss-selection';

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

    const currentIndex = this.currentIndex;
    const nextIndex = this.words.indexOf(el);

    if (currentIndex === nextIndex) return;
    this.currentIndex = nextIndex;

    const left = (currentIndex < nextIndex ? currentIndex : nextIndex);
    const right = (currentIndex < nextIndex ? nextIndex : currentIndex);
    const middle = [left, right, this.initialIndex].sort()[1];

    this.words.slice(left, middle).forEach(toggleSelected);
    this.words.slice(middle + 1, right + 1).forEach(toggleSelected);
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

    this.wrapper = span;
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
    const range = []
    if (index < this.currentIndex)
      for (let i = this.currentIndex - 1; i >= index; i--)
        range.push(i);
    else
      for (let i = this.currentIndex + 1; i <= index; i++)
        range.push(i);
    return range.map(i => this.words[i]);
  }
}
