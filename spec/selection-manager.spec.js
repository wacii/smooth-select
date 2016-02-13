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

  describe('creating selections', () => {
    it('clicks word not in selection', () => {
      triggerMouseEvent(words[0], 'mousedown');
      expect(manager.selections.length).toEqual(1);
      triggerMouseEvent(words[1], 'mousedown');
      expect(manager.selections.length).toEqual(2);
    });
  });

  describe('removing selections', () => {
    it('clicks word in existing selection', () => {
      triggerMouseEvent(words[0], 'mousedown');
      expect(manager.selections.length).toEqual(1);
      triggerMouseEvent(words[0], 'mousedown');
      expect(manager.selections.length).toEqual(0);
    });
  });

  describe('updating selections', () => {
    it('moves mouse over word not in selection', () => {
      manager.createSelection(words[0]);
      expect(manager.selections[0].toString()).toEqual('a');

      triggerMouseEvent(words[1], 'mousemove');
      expect(manager.selections[0].toString()).toEqual('a b');

      triggerMouseEvent(words[0], 'mousemove');
      expect(manager.selections[0].toString()).toEqual('a');

      triggerMouseEvent(words[2], 'mousemove');
      expect(manager.selections[0].toString()).toEqual('a b c');
    });

    it('moves mouse past or over another selection', () => {
      manager.createSelection(words[1]);
      manager.createSelection(words[0]);

      triggerMouseEvent(words[1], 'mousemove');
      expect(manager.currentSelection.toString()).toEqual('a');

      triggerMouseEvent(words[2], 'mousemove');
      expect(manager.currentSelection.toString()).toEqual('a');
    });
  });

  describe('finalizing selections', () => {
    it('release mouse button after starting selection', () => {
      triggerMouseEvent(words[0], 'mousedown');
      expect(manager.currentSelection).toBeDefined();
      triggerMouseEvent(document, 'mouseup');
      expect(manager.currentSelection).toBeFalsy();
    });
  });

  describe('#createSelection()', () => {
    it('returns a new selection', () => {
      const selection = manager.createSelection(words[0]);
      expect(selection.toString()).toEqual('a');
    });

    it('stores selection as currentSelection', () => {
      manager.createSelection(words[0]);
      expect(manager.currentSelection.toString()).toEqual('a');
    });

    it('listens to selection', () => {
      const selection = manager.createSelection(words[0]);
      expect(selection.listenerCount('finalize')).toEqual(1);
      expect(selection.listenerCount('remove')).toEqual(1)
    });
  });

  describe('#selectionContaining()', () => {
    it('tests whether it contains provided element', () => {
      expect(manager.selectionContaining(words[0])).toBeFalsy();
      const selection = manager.createSelection(words[0]);
      // selection not added to collection until finalized
      selection.finalize();
      expect(manager.selectionContaining(words[0])).toEqual(selection);
    })
  });

  describe('when selection finalized', () => {
    it('adds selection to collection', () => {
      expect(manager.selections.length).toEqual(0);
      const selection = manager.createSelection(words[0]);
      selection.finalize();
      expect(manager.selections[0]).toEqual(selection);
    });
  });
});
