'use strict';

// TODO: mock modules, you don't need the dom here
const SelectionManager = require('../src/selection-manager');
const splitter = require('../src/splitter');
const jsdom = require('jsdom').jsdom;

describe('SelectionManager', function() {
  beforeEach(function() {
    this.doc = jsdom('<p id="text">a b c</p>');
    global.document = this.doc;
    this.words = splitter(this.doc.getElementById('text'));
    this.manager = new SelectionManager(this.words);
  });

  describe('#createSelection()', function() {
    it('returns a new selection', function() {
      const selection = this.manager.createSelection(this.words[0]);
      expect(selection.toString()).toEqual('a');
    });

    it('stores selection as currentSelection', function() {
      this.manager.createSelection(this.words[0]);
      expect(this.manager.currentSelection.toString()).toEqual('a');
    });

    it('listens to selection', function() {
      const selection = this.manager.createSelection(this.words[0]);
      expect(selection.listenerCount('finalize')).toEqual(1);
      expect(selection.listenerCount('remove')).toEqual(1)
    });

    it('runs create callbacks', function() {
      const cb1 = jasmine.createSpy('cb1');
      const cb2 = jasmine.createSpy('cb2');

      this.manager.on('create', cb1);
      this.manager.on('update', cb2);
      this.manager.on('finalize', cb2);

      this.manager.createSelection(this.words[0]);
      expect(cb1).toHaveBeenCalled();
      expect(cb2).not.toHaveBeenCalled();
    });
  });

  describe('#selectionContaining()', function() {
    it('tests whether it contains provided element', function() {
      const manager = this.manager;

      expect(manager.selectionContaining(this.words[0])).toBeFalsy();
      const selection = manager.createSelection(this.words[0]);
      // selection not added to collection until finalized
      selection.finalize();
      expect(manager.selectionContaining(this.words[0])).toEqual(selection);
    })
  });

  describe('when selection finalized', function() {
    it('adds selection to collection', function() {
      expect(this.manager.selections.length).toEqual(0);
      const selection = this.manager.createSelection(this.words[0]);
      selection.finalize();
      expect(this.manager.selections[0]).toEqual(selection);
    });
  });

  describe('when selection destroyed', function() {
    it('removes selection from collection', function() {
      const selection = this.manager.createSelection(this.words[0]);
      selection.finalize();
      expect(this.manager.selections[0]).toEqual(selection);
      selection.remove();
      expect(this.manager.selections.length).toEqual(0);
    });
  });
});