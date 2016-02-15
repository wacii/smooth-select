'use strict';

// TODO: move to own file 'utils/trigger-custom-event'

exports.triggerCustomEvent = function triggerCustomEvent(el, name, data) {
  if (data === undefined) data = {};

  const event = document.createEvent('CustomEvent');
  event.initCustomEvent(name, true, true, data);
  el.dispatchEvent(event);
};
