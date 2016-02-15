'use strict';

const SelectionManager = require('../src/selection-manager');
const NestedSelection = require('../src/nested-selection');
const splitter = require('../src/splitter');
const jsdom = require('jsdom').jsdom;

describe('NestedSelection', () => {
  let manager, words, selection, nested;
  beforeEach(() => {
    global.document = jsdom('<p id="text">a b c</p>');
    words = splitter(document.getElementById('text'));
    manager = new SelectionManager(words, true);

    selection = manager.createSelection(words[0]);
    manager.finalizeSelection();
    nested = manager.createNestedSelection(words[0], selection)
  });

  it('creates within existing selection', () => {
    nested.finalizeSelection();

    const el = document.getElementsByClassName('ss-selection')[0];
    expect(el.getElementsByClassName('ss-selection').length).toEqual(1);
  });

  it('removes nested selection and related selection', () => {
    nested.finalizeSelection();

    nested.removeSelection(nested.selections[0]);
    expect(manager.selections.length).toEqual(0);
  });

  describe('#finalizeSelection', () => {
    it('dispatches ss-selection-created event', () => {
      nested.createSelection(words[0]);
      const spy = jasmine.createSpy('listener');
      document.addEventListener('ss-selection-created', spy);

      nested.finalizeSelection();
      expect(spy).toHaveBeenCalled();
    });

    // FIXME: custom event does not contain details, problem with jsdom?
    //
    // describe('emits selection as array of strings', () => {
    //   let strings;
    //   beforeEach(() => {
    //     const cb = (data) => strings = data.selection;
    //     document.addEventListener('ss-selection-created', cb);
    //   })
    //
    //   it('selects entire string', () => {
    //     nested.createSelection(words[0]);
    //     nested.finalizeSelection();
    //     expect(strings).toEqual(['', 'a', '']);
    //   });
    //
    //   it('selects at beginning of string', () => {
    //     manager.removeSelection(selection);
    //
    //     selection = manager.createSelection(words[0]);
    //     manager.updateSelection(words[2]);
    //     manager.finalizeSelection();
    //     nested = manager.createNestedSelection(words[0], selection);
    //     nested.finalizeSelection();
    //     expect(strings).toEqual(['', 'a', 'bc']);
    //   });
    //
    //   it('selects in the middle of string', () => {
    //     manager.removeSelection(selection);
    //
    //     selection = manager.createSelection(words[0]);
    //     manager.updateSelection(words[2]);
    //     manager.finalizeSelection();
    //     nested = manager.createNestedSelection(words[1], selection);
    //     nested.finalizeSelection();
    //     expect(strings).toEqual(['a', 'b', 'c']);
    //   });
    //
    //   it('selects at the end of string', () => {
    //     manager.removeSelection(selection);
    //
    //     selection = manager.createSelection(words[0]);
    //     manager.updateSelection(words[2]);
    //     manager.finalizeSelection();
    //     nested = manager.createNestedSelection(words[2], selection);
    //     nested.finalizeSelection();
    //     expect(strings).toEqual(['ab', 'c', '']);
    //   });
    // });
  });

  describe('#removeSelection()', () => {
    it('dispatches ss-selection-removed event', () => {
      const nestedSelection = nested.createSelection(words[0]);
      nested.finalizeSelection();

      const spy = jasmine.createSpy('listener');
      document.addEventListener('ss-selection-removed', spy);

      nested.removeSelection(nestedSelection);
      expect(spy).toHaveBeenCalled();
    });
  });
});
