var Selection = require('./selection');
var Words = require('./words');

smoothSelect = function smoothSelect(el) {
  var currentSelection = null;

  var words = new Words(el);
  var selecting = false

  el.addEventListener('mousedown', startSelection);
  el.addEventListener('mousemove', updateSelection);
  el.addEventListener('mouseup', endSelection);

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

    currentSelection.updateSelection(el);
  }

  function endSelection(event) {
    if (!selecting) return;

    var el = event.target;
    if (el.className !== 'ss-word') return;

    selecting = false;
  }
}

module.exports = smoothSelect;
