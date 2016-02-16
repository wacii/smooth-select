'use strict';

// Ranges defined by i0..i1 and i0..i2 with provided arr(ay).
//
module.exports = function xor(arr, i0, i1, i2) {
  const left = (i1 < i2 ? i1 : i2);
  const right = (i1 < i2 ? i2 : i1);
  const middle = [left, right, i0].sort()[1];

  return arr.slice(left, middle).concat(arr.slice(middle + 1, right + 1));
};
