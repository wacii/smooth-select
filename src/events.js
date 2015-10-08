/**
 * Register one or more listeners for provided event.
 *
 * @param {string} name - The name of an event.
 * @param {...Function} callback
 */
function on(name, callback) {
  var handlers = this.events[name] || (this.events[name] = []);
  var callbacks = Array.prototype.slice.call(arguments, 1);
  Array.prototype.push.apply(handlers, callbacks);
};

/**
 * Removes listeners for a particular event.
 *
 * If a callback is provided, the corresponding listener is removed, if found.
 * Otherwise all listeners are removed for the specified event.
 *
 * @param {string} name - The name of an event.
 * @param {Function} callback
 */
function off(name, callback) {
  var handlers = this.events[name];

  // if there are no registered listeners nothing needs to be done
  if (handlers === undefined || handlers.length === 0) return;

  // if no callback supplied, remove all listeners
  if (callback === undefined)
    return handlers.splice(0, handlers.length);

  // remove supplied callback if found
  var index = handlers.indexOf(callback);
  if (index !== -1)
    handlers.splice(index, 1);
};

exports.on = on;
exports.off = off;
