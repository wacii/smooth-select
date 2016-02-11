'use strict'

// TODO: make this an array of selections with extra behavior
//   as opposed to a normal object with selections as a property

const Selection = require(__dirname + '/selection');
const EventEmitter = require('./emitter');

/**
 * Creates a selection manager.
 *
 * @class
 * @param {Array[DOMElement]} words
 */
module.exports = class SelectionManager extends EventEmitter {

  constructor(words) {
    super();

    this.words = words;
    this.selections = [];

    var selections = this.selections;
    this.on('finalize', function(selection) {
      selections.push(selection);
    })

    this.on('remove', function(selection) {
      selections.splice(selections.indexOf(selection), 1);
    })
  }

  /**
   * Creates a selection of the given dom element.
   *
   * @param {DOMElement}
   */
  createSelection(el) {
    var selection = new Selection(el, this.words);
    this.listenTo(selection);
    this.trigger('create');
    return this.currentSelection = selection;
  }

  /**
   * Test if provided el is contained in an exisiting selection.
   *
   * @param {DOMElement}
   */
  selectionContaining(el) {
    // return first selection containing el
    var len = this.selections.length;
    for (var i = 0; i < len; i++)
      if (this.selections[i].contains(el))
        return this.selections[i];

    // otherwise return false
    return false;
  }
}
