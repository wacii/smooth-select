'use strict'

// TODO: rename selectable region
// TODO: separate event handlers from state management
//   you should be able to create/update/whatever without input

const Selection = require('./selection');
const takeWhile = require('lodash.takewhile');

/**
 * Creates a selection manager.
 *
 * @class
 * @param {Array[DOMElement]} words
 */
module.exports = class SelectionManager {
  constructor(words) {
    this.selections = [];
    this.selecting = false;

    this.words = words;

    this.onSelectionFinalized = (selection) =>
      this.selections.push(selection)

    this.onSelectionRemoved = (selection) =>
      this.selections.splice(this.selections.indexOf(selection), 1)

    document.addEventListener('mousedown', event => {
      const el = event.target;
      // assert element is a word within specified range
      if (!el.classList.contains('ss-word')) return;
      if (this.words.indexOf(el) === -1) return;

      // remove existing selection or create a new one
      const selection = this.selectionContaining(el);
      if (selection)
        this.removeSelection(selection);
      else
        this.createSelection(el);
    });

    document.addEventListener('mousemove', event => {
      if (!this.currentSelection) return;
      const el = event.target;

      // assert element is a word within specified range
      if (!el.classList.contains('ss-word')) return;
      if (this.words.indexOf(el) === -1) return;

      // test for collisions
      const words = takeWhile(this.currentSelection.wordsBetween(el), word => {
        const selection = this.selectionContaining(word);
        return !selection || selection === this.currentSelection;
      });
      const word = words[words.length - 1];

      if (word) this.currentSelection.update(word);
    });

    document.addEventListener('mouseup', () => {
      if (!this.currentSelection) return;
      this.finalizeSelection();
    });
  }

  /**
   * Creates a selection of the given dom element.
   *
   * @param {DOMElement}
   */
  createSelection(el) {
    const selection = new Selection(el, this.words);
    this.selections.push(selection);
    selection.once('finalize', this.onSelectionFinalized);
    selection.once('remove', this.onSelectionRemoved);
    return this.currentSelection = selection;
  }

  removeSelection(selection) {
    this.selections.splice(this.selections.indexOf(selection), 1);
    selection.remove();
  }

  finalizeSelection() {
    this.currentSelection.finalize();
    this.currentSelection = null;
  }

  /**
   * Test if provided el is contained in an exisiting selection.
   *
   * @param {DOMElement}
   */
  selectionContaining(el) {
    // return first selection containing el or undefined
    return this.selections.find(selection => selection.contains(el));
  }
}
