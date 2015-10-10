// TODO: registering own callbacks on currentSelection is unnecessary
//   just notify this with a trigger method or something and handle it here

var Selection = require('./selection');
var events = require('./events');

/**
 * Creates a selection manager.
 *
 * @class
 * @param {Array[DOMElement]} words
 */
function SelectionManager(words) {
  this.words = words;
  this.events = events;
  this.selections = [];
}

/**
 * Creates a selection of the given dom element.
 *
 * @param {DOMElement}
 */
SelectionManager.prototype.createSelection = function createSelection(el) {
  var selection = new Selection(el, this.words);

  // register update callbacks on selection
  var args = (this.events.update || []).slice();
  args.unshift('update');
  selection.on.apply(selection, args);

  // register finalize callbacks on selection
  args = (this.events.finalize || []).slice();
  args.unshift('finalize');
  selection.on.apply(selection, args);

  // add selection to collection when finalized
  var selections = this.selections;
  selection.on('finalize', function() {
    selections.push(this);
  });

  // remove selection from collection when destroyed
  selection.on('remove', function() {
    selections.splice(selections.indexOf(selection), 1);
  });

  // run create callbacks
  var handlers = this.events.create || [];
  var len = handlers.length;
  for (var i = 0; i < len; i++)
    handlers[i].call(selection);

  return this.currentSelection = selection;
};

/**
 * Test if provided el is contained in an exisiting selection.
 *
 * @param {DOMElement}
 */
SelectionManager.prototype.selectionContaining = selectionContaining;
function selectionContaining(el) {
  // return first selection containing el
  var len = this.selections.length;
  for (var i = 0; i < len; i++)
    if (this.selections[i].contains(el))
      return this.selections[i];

  // otherwise return false
  return false;
};

/**
 * Register one or more callbacks on this and current selection.
 *
 * @param {string} name - The name of an event.
 * @param {...Function} callback
 */
SelectionManager.prototype.on = function on(name, callback) {
  events.on.apply(this, arguments);
  if (this.currentSelection !== undefined)
    this.currentSelection.on.apply(this.currentSelection, arguments);
}

/**
 * Remove callback from this and current selection.
 *
 * @param {string} name - The name of an event.
 * @param {Function} callback
 */
SelectionManager.prototype.off = function off(name, callback) {
  events.off.call(this, name, callback);
  if (this.currentSelection !== undefined)
    this.currentSelection.off(name, callback);
}

module.exports = SelectionManager;
