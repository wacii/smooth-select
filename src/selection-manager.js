'use strict'

const Selection = require('./selection');
const takeWhile = require('lodash.takewhile');

// Creates, updates, and destroys selections based on user input.
//
module.exports = class SelectionManager {
  constructor(words) {
    this.selections = [];
    this.words = words;

    document.addEventListener('mousedown', event => {
      const el = event.target;
      if (this.words.indexOf(el) === -1) return;

      // remove existing selection or create a new one
      const selection = this._selectionContaining(el);
      if (selection)
        this.removeSelection(selection);
      else
        this.createSelection(el);
    });

    document.addEventListener('mousemove', event => {
      if (!this.currentSelection) return;
      const el = event.target;
      if (this.words.indexOf(el) === -1) return;

      this.updateSelection(el);
    });

    document.addEventListener('mouseup', () => {
      if (!this.currentSelection) return;
      this.finalizeSelection();
    });
  }

  // TODO: record assumptions on input and output

  // Create selection starting at provided dom element.
  //
  createSelection(el) {
    const selection = new Selection(el, this.words);
    return this.currentSelection = selection;
  }

  // Update the current selection with provided dom element.
  //
  updateSelection(el) {
    const word = this._lastUnselectedWord(el);
    if (word === undefined) return;
    this.currentSelection.update(word);
  }

  // Complete/finalize the current selection.
  //
  finalizeSelection() {
    this.currentSelection.finalize();
    this.selections.push(this.currentSelection);
    this.currentSelection = null;
  }

  // Remove provided selection for this and the dom.
  //
  removeSelection(selection) {
    this.selections.splice(this.selections.indexOf(selection), 1);
    selection.remove();
  }

  // Test if provided el is contained in an exisiting selection.
  //
  _selectionContaining(el) {
    // return first selection containing el or undefined
    return this.selections.find(selection => selection.contains(el));
  }

  // Returns last unselected word between current index and provided element.
  //
  _lastUnselectedWord(el) {
    const words = takeWhile(this.currentSelection.wordsBetween(el), word => {
      return !this._selectionContaining(word);
    });
    return words[words.length - 1];
  }

}
