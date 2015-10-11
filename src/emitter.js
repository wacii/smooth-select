/**
 * Register and trigger callbacks using events. Can listen to events from
 * another emittier.
 *
 * @constructor
 */
function Emitter() {
  this.events = {};
  this.listeners = [];
}

/**
 * Register one or more callbacks for provided event.
 *
 * @param {string} name - The name of an event.
 * @param {...Function} callback
 */
Emitter.prototype.on = function on(name, callback) {
  var events = this.events || (this.events = {});
  var handlers = events[name] || (events[name] = []);
  var callbacks = Array.prototype.slice.call(arguments, 1);
  Array.prototype.push.apply(handlers, callbacks);
};

/**
 * Removes callbacks for a particular event.
 *
 * If a callback is provided, the corresponding callback is removed, if found.
 * Otherwise all callbacks are removed for the specified event.
 *
 * @param {string} name - The name of an event.
 * @param {Function} callback
 */
Emitter.prototype.off = function off(name, callback) {
  var events = this.events || (this.events = {});
  var handlers = events[name];

  // if there are no registered callbacks nothing needs to be done
  if (handlers === undefined || handlers.length === 0) return;

  // if no callback supplied, remove all callbacks
  if (callback === undefined)
    return handlers.splice(0, handlers.length);

  // remove supplied callback if found
  var index = handlers.indexOf(callback);
  if (index !== -1)
    handlers.splice(index, 1);
};

/**
 * Trigger event, running all associated callbacks.
 *
 * @param {string} name - The name of an event.
 * @param {...*} Any remaining arguments are passed on to callbacks.
 */
Emitter.prototype.trigger = function trigger(name) {
  var events = this.events || (this.events = {});

  var len, i, handlers, listeners;
  var args = Array.prototype.slice.call(arguments, 1);

  // run callbacks with any passed arguments
  if (handlers = events[name])
  {
    len = handlers.length;
    for (i = 0; i < len; i++)
      handlers[i].apply(this, args);
  }

  // trigger event on listening emitters
  if (listeners = this.listeners) {
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].trigger(name, this);
  }

}

/**
 * Listen for events broadcast by another emitter.
 *
 * @param {Object} emitter
 */
Emitter.prototype.listenTo = function listenTo(emitter) {
  var listeners = emitter.listeners || (emitter.listeners = []);
  listeners.push(this);
}

module.exports = Emitter;
