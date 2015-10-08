/**
 * Wraps words of provided element in spans
 *
 * @param {HTMLElement} el
 * @return {Array} resulting spans
 * @private
 */
function splitter(el) {
  var text = el.textContent;
  if (!text || text.trim() === '') return;

  var words = text.split(' ');
  var html = '';

  var len = words.length;
  for (var i = 0; i < len; i++)
    html += '<span class="ss-word">' + words[i] + '</span>' + ' ';

  el.innerHTML = html;

  var els = el.getElementsByClassName('ss-word');
  return Array.prototype.slice.call(els);
}

module.exports = splitter;
