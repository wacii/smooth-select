'use strict';

module.exports = function wrap(wrapper, els) {
  els[0].parentNode.insertBefore(wrapper, els[0]);

  const fragment = document.createDocumentFragment();
  els.forEach(el => fragment.appendChild(el));

  wrapper.appendChild(fragment);
};
