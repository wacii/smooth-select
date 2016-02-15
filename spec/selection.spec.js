'use strict';

const Selection = require('../src/selection');
const splitter = require('../src/splitter');
const jsdom = require('jsdom').jsdom;

describe('Selection()', () => {
  const index = 0;
  let selection;
  let words;
  let doc;

  beforeEach(function () {
    doc = jsdom('<p id="text">a b c</p>');
    global.document = doc;

    words = splitter(doc.getElementById('text'));
    selection = new Selection(words[index], words);
  });

  it('adds provided el to selection when created', () => {
    expect(words[index].className).toMatch(/ss-selected/);
  });

  describe('#update()', () => {
    it('adds classes', () => {
      expect(words[1].className).not.toMatch(/ss-selected/);
      selection.update(words[1]);
      expect(words[1].className).toMatch(/ss-selected/);
      selection.update(words[2]);
      expect(words[1].className).toMatch(/ss-selected/);
      expect(words[2].className).toMatch(/ss-selected/);
    });

    it('removes classes', () => {
        selection.update(words[2]);

        expect(words[2].className).toMatch(/ss-selected/);
        selection.update(words[1]);
        expect(words[2].className).not.toMatch(/ss-selected/);
        selection.update(words[0]);
        expect(words[1].className).not.toMatch(/ss-selected/);
        expect(words[2].className).not.toMatch(/ss-selected/);
    });

    it('adds and removes classes', () => {
      words.forEach(word => word.className = 'ss-word'); // reset classes
      selection = new Selection(words[1], words);
      selection.update(words[2]);

      expect(words[0].className).not.toMatch(/ss-selected/);
      expect(words[1].className).toMatch(/ss-selected/);
      expect(words[2].className).toMatch(/ss-selected/);
      selection.update(words[0]);
      expect(words[0].className).toMatch(/ss-selected/);
      expect(words[1].className).toMatch(/ss-selected/);
      expect(words[2].className).not.toMatch(/ss-selected/);
    });
  });

  describe('#finalize()', () => {
    it('removes selected classes from words', () => {
      const classNames = () => words.map(word => word.className).join('')
      expect(classNames()).toMatch(/ss-selected/);
      selection.finalize();
      expect(classNames()).not.toMatch(/ss-selected/);
    });

    it('wraps selection in span', () => {
      selection.finalize();
      const span = doc.getElementsByTagName('span')[0];
      expect(span.textContent).toEqual(selection.toString());
      expect(span.textContent).toEqual('a');
      expect(span.className).toMatch(/ss-selection/);
    });

    it('prevents further updates', () => {
      const block = () => selection.update(words[0]);
      selection.finalize();
      expect(block).toThrow();
    });
  });

  describe('#remove()', () => {
    it('throws an error if selection has not been finalized', () => {
      var block = () => selection.remove();
      expect(block).toThrow();
    });

    it('removes wrapper', () => {
      selection.finalize();
      expect(doc.getElementsByClassName('ss-selection').length).toEqual(1);
      selection.remove();
      expect(doc.getElementsByClassName('ss-selection').length).toEqual(0);
    });
  });

  describe('#contains()', () => {
    it('test whether provided element is selected', () => {
      const words = doc.getElementsByClassName('ss-word')
      expect(selection.contains(words[0])).toBe(true);
      expect(selection.contains(words[1])).toBe(false);
    });
  })

  describe('#toString()', () => {
    it('returns text based on starting and current index', () => {
      selection.initialIndex = 1;
      selection.currentIndex = 2;

      expect(selection.toString()).toEqual('b c');

      selection.initialIndex = 1;
      selection.currentIndex = 0;

      expect(selection.toString()).toEqual('a b');
    });
  });

  describe('#wordsBetween()', () => {
    it('returns words in order to provided el', () => {
      expect(selection.wordsBetween(words[2])).toEqual(words.slice(1, 3));
      expect(selection.wordsBetween(words[1])).toEqual(words.slice(1, 2));

      selection.currentIndex = 2;
      expect(selection.wordsBetween(words[2])).toEqual([]);
      expect(selection.wordsBetween(words[0])).toEqual([words[1], words[0]]);
    })
  })
});
