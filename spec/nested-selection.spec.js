'use strict';

const SelectionManager = require('../src/selection-manager');
const NestedSelection = require('../src/nested-selection');
const splitter = require('../src/splitter');
const jsdom = require('jsdom').jsdom;

describe('NestedSelection', () => {
  let manager, words;
  beforeEach(() => {
    global.document = jsdom('<p id="text">a b c</p>');
    words = splitter(document.getElementById('text'));
    manager = new SelectionManager(words, true);
  });

  it('creates within existing selection', () => {
    const selection = manager.createSelection(words[0]);
    manager.finalizeSelection();

    const nested = manager.createNestedSelection(words[0], selection);
    nested.finalizeSelection();

    const el = document.getElementsByClassName('ss-selection')[0];
    expect(el.getElementsByClassName('ss-selection').length).toEqual(1);
  });

  it('removes nested selection and related selection', () => {
    const selection = manager.createSelection(words[0]);
    manager.finalizeSelection();

    const nested = manager.createNestedSelection(words[0], selection);
    nested.finalizeSelection();

    nested.removeSelection(nested.selections[0]);
    expect(manager.selections.length).toEqual(0);
  });
});
