var Selection = require('./selection');
var splitter = require('./splitter');

smoothSelect = function smoothSelect(el) {
  var currentSelection = null;

  var words = new splitter(el);
  var selecting = false

  el.addEventListener('mousedown', startSelection);
  el.addEventListener('mousemove', updateSelection);
  document.addEventListener('mouseup', endSelection);

  function startSelection(event) {
    if (selecting) return;

    var el = event.target;
    if (el.className !== 'ss-word') return;

    currentSelection = new Selection(el, words);
    selecting = true;
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
}

module.exports = smoothSelect;
