'use strict';

const SelectionManager = require('./selection-manager');
const triggerCustomEvent = require('./utils').triggerCustomEvent;
const slice = Array.prototype.slice;

module.exports = class NestedSelection extends SelectionManager {
  constructor(words, selectionManager, selection) {
    super(words, false);
    this.selectionManager = selectionManager;
    this.containingSelection = selection;
  }

  finalizeSelection(el) {
    super.finalizeSelection();
    const wrapper = this.containingSelection.wrapper;
    const data = { selection: this._selectionAsStrings(wrapper) };
    triggerCustomEvent(wrapper, 'ss-selection-created', data);
  }

  removeSelection(selection) {
    const wrapper = this.containingSelection.wrapper;
    triggerCustomEvent(wrapper, 'ss-selection-removed');
    super.removeSelection(selection);
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

  _selectionAsStrings(wrapper) {
    const innerSelection = wrapper.getElementsByClassName('ss-selection')[0];
    const i = Array.prototype.indexOf.call(wrapper.children, innerSelection);
    const els = wrapper.children;

    return [
      slice.call(els, 0, i).map(el => el.textContent).join(''),
      innerSelection.textContent,
      slice.call(els, i + 1, els.length).map(el => el.textContent).join(''),
    ];
  }
}
