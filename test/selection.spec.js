var Selection = require('../src/selection');
var splitter = require('../src/splitter');
var events = require('../src/events');
var jsdom = require('jsdom').jsdom;

describe('Selection()', function() {
  var index = 0;
  var selection;

  beforeEach(function () {
    this.doc = jsdom('<p id="text">a b c</p>');
    global.document = this.doc;

    var words = splitter(this.doc.getElementById('text'));
    selection = new Selection(words[index], words);
  });

  it('sets initial and current index on creation', function() {
    expect(selection.initialIndex).toEqual(index);
    expect(selection.currentIndex).toEqual(index);
  });

  // TODO: test interaction with extraneous whitespace
  // TODO: test selection extending backwards
  it('manages span tags in dom', function() {
    var wrapper = this.doc.getElementsByClassName('ss-selection')[0];
    expect(wrapper.childNodes.length).toEqual(1);

    selection.update(selection.words[1]);
    expect(wrapper.childNodes.length).toEqual(2);

    selection.update(selection.words[2]);
    expect(wrapper.childNodes.length).toEqual(3);

    selection.update(selection.words[1]);
    expect(wrapper.childNodes.length).toEqual(2);
  });

  describe('#currentIndex=', function() {
    it('throws an error if index is -1', function() {
      var block = function() {
        selection.currentIndex = -1;
      }
      expect(block).toThrow();
    });
  });

  describe('#update()', function() {
    beforeEach(function() {
      spyOn(selection, '_updateWrapper');
    });

    it('updates current index', function() {
      selection.update(selection.words[1]);
      expect(selection.currentIndex).toEqual(1)
    });

    describe('when current index changes', function() {
      it('updates wrapper', function() {
        selection.update(selection.words[1]);
        expect(selection._updateWrapper).toHaveBeenCalled();
      });

      it('runs callbacks', function() {
        var callback = jasmine.createSpy();
        selection.on('update', callback);

        selection.update(selection.words[1]);
        expect(callback).toHaveBeenCalled();
      });
    });

    describe('when current index stays the same', function() {
      it('does not update wrapper', function() {
        selection.update(selection.words[0]);
        expect(selection._updateWrapper).not.toHaveBeenCalled();
      });

      it('does not run callbacks', function() {
        var callback = jasmine.createSpy();
        selection.on('update', callback);

        selection.update(selection.words[0]);
        expect(callback).not.toHaveBeenCalled();
      });
    });
  });

  describe('#finalize()', function() {
    it('freezes the selection', function() {
      selection.finalize();
      expect(Object.isFrozen(selection)).toBe(true);
    });

    it('runs callbacks', function() {
      var callback = jasmine.createSpy();
      selection.on('finalize', callback);

      selection.finalize();
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('#remove()', function() {
    it('throws an error if selection has not been finalized', function() {
      var block = function() {
        selection.remove();
      };
      expect(block).toThrow();
    });

    it('preserves selected words', function() {
      expect(this.doc.getElementsByClassName('ss-word').length).toEqual(3)
      selection.finalize()
      selection.remove()
      expect(this.doc.getElementsByClassName('ss-word').length).toEqual(3)
    });

    it('removes wrapper from DOM', function() {
      expect(this.doc.getElementsByClassName('ss-selection').length).toEqual(1);
      selection.finalize();
      selection.remove();
      expect(this.doc.getElementsByClassName('ss-selection').length).toEqual(0);
    });
  });

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

  describe('#on()', function() {
    it('uses method from events module', function() {
      expect(selection.on).toEqual(events.on);
    });

    it('has an events object to store callbacks', function() {
      expect(typeof selection.events).toEqual('object');
    });
  });

  describe('#off()', function() {
    it('uses method from events module', function() {
      expect(selection.off).toEqual(events.off);
    });

    it('has an events object to store callbacks', function() {
      expect(typeof selection.events).toEqual('object');
    });
  });
});
