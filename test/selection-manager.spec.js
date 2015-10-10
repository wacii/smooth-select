// TODO: mock modules, you don't need the dom here

var SelectionManager = require('../src/selection-manager');
var events = require('../src/events');
var splitter = require('../src/splitter');
var jsdom = require('jsdom').jsdom;

describe('SelectionManager', function() {
  beforeEach(function() {
    this.doc = jsdom('<p id="text">a b c</p>');
    global.document = this.doc;
    this.words = splitter(this.doc.getElementById('text'));
    this.manager = new SelectionManager(this.words);
  });

  describe('#createSelection()', function() {
    it('returns a new selection', function() {
      var selection = this.manager.createSelection(this.words[0]);
      expect(selection.toString()).toEqual('a');
    });

    it('stores selection as currentSelection', function() {
      this.manager.createSelection(this.words[0]);
      expect(this.manager.currentSelection.toString()).toEqual('a');
    });

    it('registers callbacks on selection', function() {
      var cb1 = function() {};
      var cb2 = function() {};

      this.manager.on('update', cb1);
      this.manager.on('finalize', cb2);

      var selection = this.manager.createSelection(this.words[0]);
      expect(selection.events.update).toContain(cb1);
      expect(selection.events.update).not.toContain(cb2);
      expect(selection.events.finalize).toContain(cb2);
    });

    it('runs create callbacks', function() {
      var cb1 = jasmine.createSpy('cb1');
      var cb2 = jasmine.createSpy('cb2');

      this.manager.on('create', cb1);
      this.manager.on('update', cb2);
      this.manager.on('finalize', cb2);

      this.manager.createSelection(this.words[0]);
      expect(cb1).toHaveBeenCalled();
      expect(cb2).not.toHaveBeenCalled();
    });
  });

  describe('#selectionContaining()', function() {
    it('tests whether it contains provided element', function() {
      var manager = this.manager;

      expect(manager.selectionContaining(this.words[0])).toBe(false);
      var selection = manager.createSelection(this.words[0]);
      // selection not added to collection until finalized
      selection.finalize();
      expect(manager.selectionContaining(this.words[0])).toEqual(selection);
    })
  });

  describe('#on()', function() {
    it('registers callback', function() {
      var cb = function() {};
      this.manager.on('create', cb);
      expect(this.manager.events.create).toContain(cb);
    });

    it('registers callback on selection', function() {
      var cb = function() {};
      this.manager.createSelection(this.words[0]);
      this.manager.on('update', cb);
      expect(this.manager.currentSelection.events.update).toContain(cb);
    });

    // TODO: this is an implementation detail, shouldn't be tested
    //   just throw an error or something if its not found
    it('has an events object to store listeners', function() {
      expect(typeof this.manager.events).toBe('object');
    });
  });

  describe('#off()', function() {
    var cb;

    beforeEach(function() {
      cb = function() {};
    });

    it('removes callback', function() {
      (this.manager.events.create = []).push(cb);
      this.manager.off('create', cb);
      expect(this.manager.events.create.length).toEqual(0);
    });

    it('removes callback from selection', function() {
      this.manager.createSelection(this.words[0]);
      (this.manager.currentSelection.events.update = []).push(cb);
      this.manager.off('update', cb);
      expect(this.manager.currentSelection.events.update.length).toEqual(0);
    });
  })

  describe('when selection finalized', function() {
    it('adds selection to collection', function() {
      expect(this.manager.selections.length).toEqual(0);
      var selection = this.manager.createSelection(this.words[0]);
      selection.finalize();
      expect(this.manager.selections[0]).toEqual(selection);
    });
  });

  describe('when selection destroyed', function() {
    it('removes selection from collection', function() {
      var selection = this.manager.createSelection(this.words[0]);
      selection.finalize();
      expect(this.manager.selections[0]).toEqual(selection);
      selection.remove();
      expect(this.manager.selections.length).toEqual(0);
    });
  });
});
