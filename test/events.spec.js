var events = require('../src/events');

describe('events', function() {
  beforeEach(function() {
    this.model = {
      events: {},
      on: events.on,
      off: events.off
    };
  });

  describe('on()', function() {
    beforeEach(function() {
      this.cb1 = function() {};
      this.cb2 = function() {};
      this.cb3 = function() {};

      expect(this.model.events.update).toBeUndefined();
      expect(this.model.events.finalize).toBeUndefined();
    });

    it('registers listener on event', function() {
      var events = this.model.events;

      this.model.on('update', this.cb1);
      expect(events.update[0]).toEqual(this.cb1);

      this.model.on('update', this.cb2);
      expect(events.update.length).toEqual(2);
      expect(events.update[1]).toEqual(this.cb2);

      this.model.on('finalize', this.cb3);
      expect(events.update.length).toEqual(2);
      expect(events.finalize[0]).toEqual(this.cb3);
    });

    it('registers multiple listeners on event', function() {
      var events = this.model.events;

      this.model.on('update', this.cb1, this.cb2);
      expect(events.update[0]).toEqual(this.cb1);
      expect(events.update[1]).toEqual(this.cb2);
    });
  });

  describe('off()', function() {
    beforeEach(function() {
      this.cb1 = function() {};
      this.cb2 = function() {};

      this.model.on('update', this.cb1, this.cb2);
      this.model.on('finalize', this.cb1, this.cb2);
    });

    it('removes specified listener from event', function() {
      var events = this.model.events;

      this.model.off('update', this.cb1);
      expect(events.update.length).toEqual(1);
      expect(events.update[0]).toEqual(this.cb2);
      expect(events.finalize.length).toEqual(2);
    });

    describe('when callback not specified', function() {
      it('removes all listeners from event', function() {
        var events = this.model.events;

        this.model.off('update');
        expect(events.update.length).toEqual(0);
        expect(events.finalize.length).toEqual(2);
      });
    });
  });
});
