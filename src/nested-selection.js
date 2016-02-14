'use strict';

const SelectionManager = require('./selection-manager');

module.exports = class NestedSelection extends SelectionManager {
  constructor(words, selectionManager, selection) {
    super(words, false);
    this.selectionManager = selectionManager;
    this.containingSelection = selection;
  }

  removeSelection(selection) {
    selection.remove();
    this.selectionManager.removeSelection(this.containingSelection);
    // TODO: remove event listeners
  }

  // TODO: this method is not named properly used like this
  _selectionContaining(el) {
    return this.currentSelection;
  }

  _lastUnselectedWord(el) {
    return el;
  }
}
