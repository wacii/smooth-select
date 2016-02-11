'use strict';

const SelectionManager = require('./selection-manager');
const splitter = require('./splitter');

const smoothSelect = function smoothSelect(el) {
  const words = new splitter(el);
  let selecting = false
  let currentSelection;

  const manager = new SelectionManager(words);

  el.addEventListener('mousedown', startSelection);
  el.addEventListener('mousemove', updateSelection);
  document.addEventListener('mouseup', endSelection);

  function startSelection(event) {
    if (selecting) return;

    const el = event.target;
    if (el.className !== 'ss-word') return;

    const overlappingSelection = manager.selectionContaining(el);

    if (overlappingSelection) {
      overlappingSelection.remove();
    } else {
      currentSelection = manager.createSelection(el);
      selecting = true;
    }
  }

  function updateSelection(event) {
    if (!selecting) return;

    const el = event.target;
    if (el.className !== 'ss-word') return;

    currentSelection.update(el);
  }

  function endSelection(event) {
    if (!selecting) return;

    currentSelection.finalize();
    selecting = false;
  }

  return manager;
}

module.exports = smoothSelect;
