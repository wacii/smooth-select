'use strict';

const slice = Array.prototype.slice;

/**
 * Wraps words of provided element in spans
 *
 * @param {HTMLElement} el
 * @return {Array} resulting spans
 * @private
 */
function splitter(el) {
  const text = el.textContent;
  if (!text || text.trim() === '') return;

  const words = text.split(' ');
  const html = words
    .map(word => `<span class="ss-word">${word}</span>`)
    .join(' ');

  el.innerHTML = html;

  const els = el.getElementsByClassName('ss-word');
  return slice.call(els);
}

module.exports = splitter;
