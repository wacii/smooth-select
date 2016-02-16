'use strict';

const slice = Array.prototype.slice;

module.exports = function unwrap(wrapper) {
  const els = slice.call(wrapper.children);
  const fragment = document.createDocumentFragment();
  els.forEach(el => fragment.appendChild(el));

  const parent = wrapper.parentNode;
  parent.insertBefore(fragment, wrapper);
  parent.removeChild(wrapper);
};
