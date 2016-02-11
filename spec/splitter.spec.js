'use strict';

const splitter = require('../src/splitter');
const jsdom = require('jsdom').jsdom;

describe('splitter()', () => {
  it('wraps words in spans', () => {
    const doc = jsdom('<p id="text">a b</p>');
    const words = splitter(doc.getElementById('text'));

    expect(words[0].textContent).toEqual('a');
    expect(words[1].textContent).toEqual('b');
  });

  it('labels spans with ss-word class', () => {
    const doc = jsdom('<p id="text">a b</p>');
    const words = splitter(doc.getElementById('text'));

    expect(words[0].className).toEqual('ss-word');
    expect(words[1].className).toEqual('ss-word');
  });
});
