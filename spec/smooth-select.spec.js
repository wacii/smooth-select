'use strict';

const smoothSelect = require('../smooth-select');
const jsdom = require('jsdom').jsdom;
const slice = Array.prototype.slice;

describe('smoothSelect()', () => {
  it('does stuff', () => {
    const doc = jsdom('<p id="text">a b c</p>');
    global.document = doc;
    smoothSelect(doc.getElementById('text'));

    function selectedText() {
      let selected = doc.getElementsByClassName('ss-selected');
      return slice.call(selected).map(el => el.textContent).join('');
    }

    function selectionText() {
      let selection = doc.getElementsByClassName('ss-selection')[0];
      return selection.textContent;
    }

    // click on word to begin selection
    const words = doc.getElementsByClassName('ss-word');
    let event = doc.createEvent('MouseEvent');
    event.initEvent('mousedown', true, true)
    words[0].dispatchEvent(event);
    //
    expect(selectedText()).toEqual('a')

    // move mouse over words to change selection
    event = doc.createEvent('MouseEvent');
    event.initEvent('mousemove', true, true);
    words[1].dispatchEvent(event);
    //
    expect(selectedText()).toEqual('ab')

    // lift mouse button to finalize selection
    event = doc.createEvent('MouseEvent');
    event.initEvent('mouseup', true, true);
    doc.dispatchEvent(event);
    //
    event = doc.createEvent('MouseEvent');
    event.initEvent('mousemove', true, true);
    words[2].dispatchEvent(event);
    //
    expect(selectionText()).toEqual('ab')
    expect(selectedText()).toEqual('')

    // click existing selection to remove it
    event = doc.createEvent('MouseEvent');
    event.initEvent('mousedown', true, true);
    words[0].dispatchEvent(event);
    //
    let selections = doc.getElementsByClassName('ss-selection');
    expect(selections.length).toEqual(0);
  });
});
