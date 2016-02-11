var splitter = require('../src/splitter');
var jsdom = require('jsdom').jsdom;

describe('splitter()', function() {
  it('wraps words in spans', function() {
    var doc = jsdom('<p id="text">a b</p>');
    var words = splitter(doc.getElementById('text'));

    expect(words[0].textContent).toEqual('a');
    expect(words[1].textContent).toEqual('b');
  });

  it('labels spans with ss-word class', function() {
    var doc = jsdom('<p id="text">a b</p>');
    var words = splitter(doc.getElementById('text'));

    expect(words[0].className).toEqual('ss-word');
    expect(words[1].className).toEqual('ss-word');
  });
});
