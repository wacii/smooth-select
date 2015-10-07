var Selection = require('../src/selection');

describe('Selection()', function() {
  var index = 1;
  beforeEach(function () {
    var words = jasmine.createSpyObj(
      'words',
      ['getText', 'indexOf', 'slice']
    );
    words.indexOf.andReturn(index);
    words.slice.andReturn([]);
    this.words = words;
    this.selection = new Selection(index, words);
  });

  it('sets initial and current index on creation', function() {
    expect(this.selection.initialIndex).toEqual(index);
    expect(this.selection.currentIndex).toEqual(index);
  });

  // TODO: test the function working as expected in the DOM

  describe('#currentIndex=', function() {
    it('throws an error if index is -1', function() {
      var block = function() {
        this.selection.currentIndex = -1;
      }
      expect(block).toThrow();
    });
  });

  describe('#updateWrapper()', function() {
    it('appends elements in current selection to wrapper', function() {
      spyOn(this.selection.wrapper, 'appendChild');
      var el = null;
      this.words.slice.andReturn([el]);

      this.selection.updateWrapper();
      expect(this.selection.wrapper.appendChild).toHaveBeenCalledWith(el);
    });
  });

  describe('#updateIndex()', function() {
    beforeEach(function() {
      spyOn(this.selection, 'updateWrapper');
    });

    it('updates current index', function() {
      this.selection.updateIndex(/* el whose index resolves to 1 */);
      expect(this.selection.currentIndex).toEqual(1)
    });

    it('updates wrapper', function() {
      this.selection.updateIndex(/* el whose index resolves to 1 */);
      expect(this.selection.updateWrapper).toHaveBeenCalled();
    });
  });

  describe('#getText()', function() {
    it('returns text based on starting and current index', function() {
      this.selection.initialIndex = 1;
      this.selection.currentIndex = 3;

      this.selection.getText()
      expect(this.selection.words.getText).toHaveBeenCalledWith(1, 4)

      this.selection.initialIndex = 3;
      this.selection.currentIndex = 1;

      this.selection.getText()
      expect(this.selection.words.getText).toHaveBeenCalledWith(1, 4)
    });
  });
});
