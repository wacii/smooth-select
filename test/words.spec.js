var Words = require('../src/words');
var jsdom = require('jsdom').jsdom;

describe('Words()', function() {
  beforeEach(function () {
    var doc = jsdom('<p id="text">a b c</p>');
    this.words = new Words(doc.getElementById('text'));

    this.el1 = this.words.els[0];
    this.el2 = this.words.els[1];
  });

  describe('#toggleSelections()', function() {
    it('toggles selected class name on all elements', function () {
      expect(this.el1.classList.contains('ss-selected')).toBe(false);
      expect(this.el2.classList.contains('ss-selected')).toBe(false);

      this.words.toggleSelections([0, 1]);

      expect(this.el1.classList.contains('ss-selected')).toBe(true);
      expect(this.el2.classList.contains('ss-selected')).toBe(true);

      this.words.toggleSelections([1]);

      expect(this.el1.classList.contains('ss-selected')).toBe(true);
      expect(this.el2.classList.contains('ss-selected')).toBe(false);
    })
  });

  describe('#getText()', function() {
    it('returns text corresponding to range of indices', function() {
      expect(this.words.getText(0, 1)).toEqual('a b');
      expect(this.words.getText(1, 2)).toEqual('b c');
      expect(this.words.getText(0, 2)).toEqual('a b c');
    })
  });
});
