'use strict';

const SelectionManager = require('../src/selection-manager');
const splitter = require('../src/splitter');
const jsdom = require('jsdom').jsdom;

describe('SelectionManager', () => {
  let manager, words;
  beforeEach(() => {
    const doc = jsdom('<p id="text">a b c</p>');
    global.document = doc;
    words = splitter(doc.getElementById('text'));
    manager = new SelectionManager(words);
  });

  describe('#createSelection()', () => {
    it('returns selection created with provided element', () => {
      const selection = manager.createSelection(words[0]);
      expect(selection.toString()).toEqual('a');
    });

    it('assigns selection to currentSelection', () => {
      manager.createSelection(words[1]);
      expect(manager.currentSelection.toString()).toEqual('b');
    });
  });

  describe('#updateSelection()', () => {
    it('updates with unselected words', () => {
      manager.createSelection(words[0]);

      manager.updateSelection(words[1]);
      expect(manager.currentSelection.toString()).toEqual('a b');

      manager.updateSelection(words[0]);
      expect(manager.currentSelection.toString()).toEqual('a');

      manager.updateSelection(words[2]);
      expect(manager.currentSelection.toString()).toEqual('a b c');
    });

    it('does not update with already selected words', () => {
      manager.createSelection(words[1]);
      manager.updateSelection(words[2]);
      manager.finalizeSelection();

      manager.createSelection(words[0]);

      manager.updateSelection(words[1]);
      expect(manager.currentSelection.toString()).toEqual('a');

      manager.updateSelection(words[2]);
      expect(manager.currentSelection.toString()).toEqual('a');
    });

    it('does not update with words past other selections', () => {
      manager.createSelection(words[1]);
      manager.finalizeSelection();

      manager.createSelection(words[0]);

      manager.updateSelection(words[2]);
      expect(manager.currentSelection.toString()).toEqual('a');
    });
  });

  describe('#finalizeSelection()', () => {
    it('adds finalized selection to collection', () => {
      manager.createSelection(words[0]);
      manager.finalizeSelection();
      expect(manager.selections.length).toEqual(1);
    });

    it('sets currentSelection to null', () => {
      manager.createSelection(words[0]);
      manager.finalizeSelection();
      expect(manager.currentSelection).toBe(null);
    });

    it('dispatches ss-selection-created event', () => {
      manager.createSelection(words[0]);
      const spy = jasmine.createSpy('listener')
      document.addEventListener('ss-selection-created', spy);

      manager.finalizeSelection();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('#removeSelection()', () => {
    it('removes selection from dom', () => {
      const selection = manager.createSelection(words[0]);
      manager.finalizeSelection();
      manager.removeSelection(selection);
      const els = document.getElementsByClassName('ss-selection');
      expect(els.length).toEqual(0);
    });

    it('removes selection from collection', () => {
      const selection = manager.createSelection(words[0]);
      manager.finalizeSelection();
      manager.removeSelection(selection);
      expect(manager.selections.length).toEqual(0);
    });

    it('dispatches ss-selection-removed event', () => {
      const selection = manager.createSelection(words[0]);
      manager.finalizeSelection();

      const spy = jasmine.createSpy('listener');
      document.addEventListener('ss-selection-removed', spy);

      manager.removeSelection(selection);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('#createNestedSelection()', () => {
    let selection;
    beforeEach(() => {
      selection = manager.createSelection(words[0]);
      manager.finalizeSelection();
    });

    it('marks selection as nested', () => {
      expect(selection.nested).toBeFalsy();
      manager.createNestedSelection(words[0], selection);
      expect(selection.nested).toBeTruthy();
    });

    it('creates a nested selection', () => {
      const nested = manager.createNestedSelection(words[0], selection);
      nested.finalizeSelection();

      const wrappers = document.getElementsByClassName('ss-selection');
      expect(wrappers.length).toEqual(2);

      const innerWrapper = document.querySelector('ss-selection ss-selection');
      expect(innerWrapper).toBeDefined()
    })
  });
});
