'use strict';

module.exports = function range(a, b) {
  const range = [];
  if (a < b) for (let i = b - 1; i >= a; i--) range.push(i);
  else for (let i = b + 1; i <= a; i++) range.push(i);
  return range;
};
