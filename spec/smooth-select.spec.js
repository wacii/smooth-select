'use strict';

const smoothSelect = require('../src/smooth-select');
const jsdom = require('jsdom').jsdom;

// TODO: why doesn't the textcontent have spaces?
describe('smoothSelect()', function() {
  // it('does stuff', function() {
  //   const doc = jsdom('<p id="text">a b c</p>');
  //   global.document = doc;
  //   smoothSelect(doc.getElementById('text'));
  //
  //   // click on word to begin selection
  //   const words = doc.getElementsByClassName('ss-word');
  //   let event = doc.createEvent('MouseEvent');
  //   event.initEvent('mousedown', true, true)
  //   words[0].dispatchEvent(event);
  //   //
  //   const wrapper = doc.getElementsByClassName('ss-selection')[0];
  //   expect(wrapper.textContent).toEqual('a')
  //
  //   // move mouse over words to change selection
  //   event = doc.createEvent('MouseEvent');
  //   event.initEvent('mousemove', true, true);
  //   words[1].dispatchEvent(event);
  //   //
  //   expect(wrapper.textContent).toEqual('ab')
  //
  //   // lift mouse button to finalize selection
  //   event = doc.createEvent('MouseEvent');
  //   event.initEvent('mouseup', true, true);
  //   doc.dispatchEvent(event);
  //   //
  //   event = doc.createEvent('MouseEvent');
  //   event.initEvent('mousemove', true, true);
  //   words[2].dispatchEvent(event);
  //   //
  //   expect(wrapper.textContent).toEqual('ab')
  //
  //   // click existing selection to remove it
  //   event = doc.createEvent('MouseEvent');
  //   event.initEvent('mousedown', true, true);
  //   words[0].dispatchEvent(event);
  //   //
  //   const wrappers = doc.getElementsByClassName('ss-selection');
  //   expect(wrappers.length).toEqual(0);
  // });

  it('returns a selection manager', function() {
    const doc = jsdom('<p id="text">a b c</p>');
    global.document = doc;
    const manager = smoothSelect(doc.getElementById('text'));

    expect(typeof manager.createSelection).toEqual('function');
    expect(typeof manager.selectionContaining).toEqual('function');
  });
});
