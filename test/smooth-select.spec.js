var smoothSelect = require('../src/smooth-select');
var jsdom = require('jsdom').jsdom;

describe('smoothSelect()', function() {
  it('does stuff', function() {
    var doc = jsdom('<p id="text">a b c</p>');
    global.document = doc;
    smoothSelect(doc.getElementById('text'));

    var words = doc.getElementsByClassName('ss-word');

    var event = doc.createEvent('MouseEvent');
    event.initEvent('mousedown', true, true)
    words[0].dispatchEvent(event);
    //
    spans = doc.getElementsByTagName('span');
    expect(spans[0].className).toEqual('ss-start-selection');
    expect(spans[1].textContent).toEqual('a');
    expect(spans[2].className).toEqual('ss-end-selection');

    event = doc.createEvent('MouseEvent');
    event.initEvent('mousemove', true, true);
    words[1].dispatchEvent(event);
    //
    spans = doc.getElementsByTagName('span');
    expect(spans[2].textContent).toEqual('b');
    expect(spans[3].className).toEqual('ss-end-selection');

    // event = doc.createEvent('MouseEvent');
    // event.initEvent('mouseup', true, true);
    // doc.dispatchEvent(event);
    // //
    // event = doc.createEvent('MouseEvent');
    // event.initEvent('mousemove', true, true);
    // words[2].dispatchEvent(event);
    // //
    // spans = doc.getElementsByTagName('span');
    // expect(spans[3].className).toEqual('ss-end-selection');
  });
});
