/**
 * Register one or more callbacks for provided event.
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
 * Removes callbacks for a particular event.
 *
 * If a callback is provided, the corresponding callback is removed, if found.
 * Otherwise all callbacks are removed for the specified event.
 *
 * @param {string} name - The name of an event.
 * @param {Function} callback
 */
function off(name, callback) {
  var handlers = this.events[name];

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

exports.on = on;
exports.off = off;
