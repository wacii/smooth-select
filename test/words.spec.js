var Words = require('../src/words');
var jsdom = require('jsdom').jsdom;

describe('Words()', function() {
  beforeEach(function () {
    var doc = jsdom('<p id="text">a b c</p>');
    this.words = new Words(doc.getElementById('text'));

    this.word1 = this.words[0];
    this.word2 = this.words[1];
  });

  describe('#getText()', function() {
    it('returns text corresponding to range of indices', function() {
      expect(this.words.getText(0, 2)).toEqual('a b');
      expect(this.words.getText(1, 3)).toEqual('b c');
      expect(this.words.getText(0, 3)).toEqual('a b c');
    })
  });

  describe('#indexOf()', function() {
    it('returns index of provided element', function() {
      expect(this.words.indexOf(this.word1)).toEqual(0);
      expect(this.words.indexOf(this.word2)).toEqual(1);
      expect(this.words.indexOf(null)).toEqual(-1);
    })
  });

  describe('#slice()', function() {
    it('returns elements in specified range', function() {
      expect(this.words.slice(0, 2).length).toEqual(2);
      expect(this.words.slice(1, 2).length).toEqual(1);
      expect(this.words.slice(1, 2)[0]).toEqual(this.word2);
    })
  });
});
