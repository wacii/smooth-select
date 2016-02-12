'use strict';

const Selection = require('../src/selection');
const splitter = require('../src/splitter');
const jsdom = require('jsdom').jsdom;

describe('Selection()', function() {
  const index = 0;
  let selection;
  let words;

  beforeEach(function () {
    this.doc = jsdom('<p id="text">a b c</p>');
    global.document = this.doc;

    words = splitter(this.doc.getElementById('text'));
    selection = new Selection(words[index], words);
  });

  it('adds provided el to selection when created', () => {
    expect(words[index].className).toMatch(/ss-selected/);
  });

  describe('#update()', function() {
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

  describe('#finalize()', function() {
    it('runs callbacks', function() {
      const callback = jasmine.createSpy();
      selection.on('finalize', callback);

      selection.finalize();
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('#remove()', function() {
    // it('throws an error if selection has not been finalized', function() {
    //   var block = function() {
    //     selection.remove();
    //   };
    //   expect(block).toThrow();
    // });

    // it('removes wrapper', function() {
    //   expect(this.doc.getElementsByClassName('ss-selection').length).toEqual(1);
    //   selection.finalize();
    //   selection.remove();
    //   expect(this.doc.getElementsByClassName('ss-selection').length).toEqual(0);
    // });

    it('runs callbacks', function() {
      const callback = jasmine.createSpy('onRemove');
      selection.on('remove', callback);

      selection.finalize();
      selection.remove();
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('#contains()', function() {
    it('test whether provided element is selected', function() {
      const words = this.doc.getElementsByClassName('ss-word')
      expect(selection.contains(words[0])).toBe(true);
      expect(selection.contains(words[1])).toBe(false);
    });
  })

  describe('#toString()', function() {
    it('returns text based on starting and current index', function() {
      selection.initialIndex = 1;
      selection.currentIndex = 2;

      expect(selection.toString()).toEqual('b c');

      selection.initialIndex = 1;
      selection.currentIndex = 0;

      expect(selection.toString()).toEqual('a b');
    });
  });
});
