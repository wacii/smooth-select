var Emitter = require('../src/emitter');

describe('Emitter', function() {
  var emitter;
  beforeEach(function() {
    emitter = new Emitter();
  });

  describe('#on()', function() {
    beforeEach(function() {
      this.cb1 = function() {};
      this.cb2 = function() {};
      this.cb3 = function() {};

      expect(emitter.events.update).toBeUndefined();
      expect(emitter.events.finalize).toBeUndefined();
    });

    it('registers listener on event', function() {
      var events = emitter.events;

      emitter.on('update', this.cb1);
      expect(events.update[0]).toEqual(this.cb1);

      emitter.on('update', this.cb2);
      expect(events.update.length).toEqual(2);
      expect(events.update[1]).toEqual(this.cb2);

      emitter.on('finalize', this.cb3);
      expect(events.update.length).toEqual(2);
      expect(events.finalize[0]).toEqual(this.cb3);
    });

    it('registers multiple listeners on event', function() {
      var events = emitter.events;

      emitter.on('update', this.cb1, this.cb2);
      expect(events.update[0]).toEqual(this.cb1);
      expect(events.update[1]).toEqual(this.cb2);
    });
  });

  describe('#off()', function() {
    beforeEach(function() {
      this.cb1 = function() {};
      this.cb2 = function() {};

      emitter.on('update', this.cb1, this.cb2);
      emitter.on('finalize', this.cb1, this.cb2);
    });

    it('removes specified listener from event', function() {
      var events = emitter.events;

      emitter.off('update', this.cb1);
      expect(events.update.length).toEqual(1);
      expect(events.update[0]).toEqual(this.cb2);
      expect(events.finalize.length).toEqual(2);
    });

    describe('when callback not specified', function() {
      it('removes all listeners from event', function() {
        var events = emitter.events;

        emitter.off('update');
        expect(events.update.length).toEqual(0);
        expect(events.finalize.length).toEqual(2);
      });
    });
  });

  describe('#trigger()', function() {
    it('runs associated callbacks with arguments', function() {
      var cb1 = jasmine.createSpy();
      var cb2 = jasmine.createSpy();
      emitter.on('update', cb1);
      emitter.on('destroy', cb2);

      emitter.trigger('update', 1, 2);
      expect(cb1).toHaveBeenCalledWith(1, 2);
      expect(cb2).not.toHaveBeenCalled();
    });

    it('triggers event on listeners', function() {
      var listener = new Emitter();
      emitter.listeners.push(listener);
      spyOn(listener, 'trigger');

      emitter.trigger('create');
      expect(listener.trigger).toHaveBeenCalled();
    });
  });
});
