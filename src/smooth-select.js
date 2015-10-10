var SelectionManager = require('./selection-manager');
var splitter = require('./splitter');

smoothSelect = function smoothSelect(el) {
  var words = new splitter(el);
  var selecting = false

  var manager = new SelectionManager(words);

  el.addEventListener('mousedown', startSelection);
  el.addEventListener('mousemove', updateSelection);
  document.addEventListener('mouseup', endSelection);

  function startSelection(event) {
    if (selecting) return;

    var el = event.target;
    if (el.className !== 'ss-word') return;

    var overlappingSelection = manager.selectionContaining(el);

    if (overlappingSelection) {
      overlappingSelection.remove();
    } else {
      currentSelection = manager.createSelection(el);
      selecting = true;
    }
  }

  function updateSelection(event) {
    if (!selecting) return;

    var el = event.target;
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
