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

    this.selection.update(this.selection.words[1]);
    spans = this.doc.getElementsByTagName('span');
    expect(spans[2].textContent).toEqual('b');
    expect(spans[3].className).toEqual('ss-end-selection');

    this.selection.update(this.selection.words[2]);
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

  describe('#update()', function() {
    beforeEach(function() {
      spyOn(this.selection, '_updateWrapper');
    });

    it('updates current index', function() {
      this.selection.update(this.selection.words[1]);
      expect(this.selection.currentIndex).toEqual(1)
    });

    describe('when current index changes', function() {
      it('updates wrapper', function() {
        this.selection.update(this.selection.words[1]);
        expect(this.selection._updateWrapper).toHaveBeenCalled();
      });

      it('runs callbacks', function() {
        var callback = jasmine.createSpy();
        this.selection.on('update', callback);

        this.selection.update(this.selection.words[1]);
        expect(callback).toHaveBeenCalled();
      });
    });

    describe('when current index stays the same', function() {
      it('does not update wrapper', function() {
        this.selection.update(this.selection.words[0]);
        expect(this.selection._updateWrapper).not.toHaveBeenCalled();
      });

      it('does not run callbacks', function() {
        var callback = jasmine.createSpy();
        this.selection.on('update', callback);

        this.selection.update(this.selection.words[0]);
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
      this.selection.on('finalize', callback);

      this.selection.finalize();
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('#toString()', function() {
    it('returns text based on starting and current index', function() {
      this.selection.initialIndex = 1;
      this.selection.currentIndex = 2;

      expect(this.selection.toString()).toEqual('b c');

      this.selection.initialIndex = 1;
      this.selection.currentIndex = 0;

      expect(this.selection.toString()).toEqual('a b');
    });
  });

  describe('#on()', function() {
    beforeEach(function() {
      this.cb1 = function() {};
      this.cb2 = function() {};
      this.cb3 = function() {};

      expect(this.selection.events.update).toBeUndefined();
      expect(this.selection.events.finalize).toBeUndefined();
    });

    it('registers listener on event', function() {
      var events = this.selection.events;

      this.selection.on('update', this.cb1);
      expect(events.update[0]).toEqual(this.cb1);

      this.selection.on('update', this.cb2);
      expect(events.update.length).toEqual(2);
      expect(events.update[1]).toEqual(this.cb2);

      this.selection.on('finalize', this.cb3);
      expect(events.update.length).toEqual(2);
      expect(events.finalize[0]).toEqual(this.cb3);
    });

    it('registers multiple listeners on event', function() {
      var events = this.selection.events;

      this.selection.on('update', this.cb1, this.cb2);
      expect(events.update[0]).toEqual(this.cb1);
      expect(events.update[1]).toEqual(this.cb2);
    });
  });

  describe('#off()', function() {
    beforeEach(function() {
      this.cb1 = function() {};
      this.cb2 = function() {};

      this.selection.on('update', this.cb1, this.cb2);
      this.selection.on('finalize', this.cb1, this.cb2);
    });

    it('removes specified listener from event', function() {
      var events = this.selection.events;

      this.selection.off('update', this.cb1);
      expect(events.update.length).toEqual(1);
      expect(events.update[0]).toEqual(this.cb2);
      expect(events.finalize.length).toEqual(2);
    });

    describe('when callback not specified', function() {
      it('removes all listeners from event', function() {
        var events = this.selection.events;

        this.selection.off('update');
        expect(events.update.length).toEqual(0);
        expect(events.finalize.length).toEqual(2);
      });
    });
  });
});
