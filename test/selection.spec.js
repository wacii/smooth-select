var Selection = require('../src/selection');
var splitter = require('../src/splitter');
var jsdom = require('jsdom').jsdom;

describe('Selection()', function() {
  var index = 0;

  beforeEach(function () {
    this.doc = jsdom('<p id="text">a b c</p>');
    global.document = this.doc;

    var words = splitter(this.doc.getElementById('text'));
    this.selection = new Selection(words[index], words);
  });

  it('sets initial and current index on creation', function() {
    expect(this.selection.initialIndex).toEqual(index);
    expect(this.selection.currentIndex).toEqual(index);
  });

  // TODO: test interaction with extraneous whitespace
  // TODO: test selection extending backwards
  it('manages span tags in dom', function() {
    var spans = this.doc.getElementsByTagName('span');
    expect(spans[0].className).toEqual('ss-start-selection');
    expect(spans[1].textContent).toEqual('a');
    expect(spans[2].className).toEqual('ss-end-selection');
    var el = this.doc.getElementById('text')

    this.selection.updateSelection(this.selection.words[1]);
    spans = this.doc.getElementsByTagName('span');
    expect(spans[2].textContent).toEqual('b');
    expect(spans[3].className).toEqual('ss-end-selection');

    this.selection.updateSelection(this.selection.words[2]);
    spans = this.doc.getElementsByTagName('span');
    expect(spans[3].textContent).toEqual('c');
    expect(spans[4].className).toEqual('ss-end-selection');
  });

  describe('#currentIndex=', function() {
    it('throws an error if index is -1', function() {
      var block = function() {
        this.selection.currentIndex = -1;
      }
      expect(block).toThrow();
    });
  });

  describe('#updateSelection()', function() {
    beforeEach(function() {
      spyOn(this.selection, '_updateWrapper');
    });

    it('updates current index', function() {
      this.selection.updateSelection(this.selection.words[1]);
      expect(this.selection.currentIndex).toEqual(1)
    });

    describe('when current index changes', function() {
      it('updates wrapper', function() {
        this.selection.updateSelection(this.selection.words[1]);
        expect(this.selection._updateWrapper).toHaveBeenCalled();
      });

      it('runs callbacks', function() {
        var callback = jasmine.createSpy();
        this.selection.onUpdate(callback);

        this.selection.updateSelection(this.selection.words[1]);
        expect(callback).toHaveBeenCalled();
      });
    });

    describe('when current index stays the same', function() {
      it('does not update wrapper', function() {
        this.selection.updateSelection(this.selection.words[0]);
        expect(this.selection._updateWrapper).not.toHaveBeenCalled();
      });

      it('does not run callbacks', function() {
        var callback = jasmine.createSpy();
        this.selection.onUpdate(callback);

        this.selection.updateSelection(this.selection.words[0]);
        expect(callback).not.toHaveBeenCalled();
      });
    });
  });

  describe('#finalize()', function() {
    it('freezes the selection', function() {
      this.selection.finalize();
      expect(Object.isFrozen(this.selection)).toBe(true);
    });

    it('runs callbacks', function() {
      var callback = jasmine.createSpy();
      this.selection.onFinalize(callback);

      this.selection.finalize();
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('#getText()', function() {
    it('returns text based on starting and current index', function() {
      this.selection.initialIndex = 1;
      this.selection.currentIndex = 2;

      expect(this.selection.getText()).toEqual('b c');

      this.selection.initialIndex = 1;
      this.selection.currentIndex = 0;

      expect(this.selection.getText()).toEqual('a b');
    });
  });
});
