'use strict';

global.triggerMouseEvent = function triggerMouseEvent(el, eventName) {
  const event = document.createEvent('MouseEvent');
  event.initEvent(eventName, true, true);
  el.dispatchEvent(event);
}
