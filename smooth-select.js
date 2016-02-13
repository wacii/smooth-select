'use strict';

const SelectionManager = require('./src/selection-manager');
const splitter = require('./src/splitter');

module.exports = function smoothSelect(el) {
  new SelectionManager(splitter(el));
}
