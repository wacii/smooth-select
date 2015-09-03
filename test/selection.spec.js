var Selection = require('../src/selection');

describe('Selection()', function() {
  var index = 1;
  beforeEach(function () {
    var words = jasmine.createSpyObj(
      'words',
      ['toggleSelections', 'getText', 'indexOf']
    );
    words.indexOf.andReturn(index);
    this.words = words;
    this.selection = new Selection(index, words)
  });

  it('sets starting, current, and previous index on creation', function() {
    expect(this.selection.startingIndex).toEqual(index)
    expect(this.selection.previousIndex).toEqual(index)
    expect(this.selection.currentIndex).toEqual(index)
  });

  describe('#updateIndex()', function() {
    it('updates previous index', function() {
      this.selection.currentIndex = 2;
      expect(this.selection.previousIndex).toEqual(index)

      this.words.indexOf.andReturn(3)
      this.selection.updateIndex(/* el whose index resolves to 3 */);
      expect(this.selection.previousIndex).toEqual(2)
    });

    it('updates current index', function() {
      this.words.indexOf.andReturn(2)
      this.selection.updateIndex(/* el whose index resolves to 2 */);
      expect(this.selection.currentIndex).toEqual(2)
    });

    it('emits changes in selection as array of indices', function() {
      var indices = [1, 2, 3];
      this.selection.changedIndices = function() { return indices; };
      this.selection.updateIndex(1);

      var fn = this.selection.words.toggleSelections;
      expect(fn).toHaveBeenCalledWith(indices);
    });
  });

  describe('#changedIndices()', function() {
    it('returns empty array when no change', function() {
      expect(this.selection.changedIndices()).toEqual([]);
    });

    describe('when (1, 3) to (1, 1)', function() {
      it('returns [2, 3]', function() {
        this.selection.startingIndex = 1;
        this.selection.previousIndex = 3;
        this.selection.currentIndex = 1;

        var array = this.selection.changedIndices();
        expect(array).toContain(2);
        expect(array).toContain(3);
      });
    });

    describe('when (1, 3) to (1, 5)', function() {
      it('returns [4, 5]', function() {
        this.selection.startingIndex = 1;
        this.selection.previousIndex = 3;
        this.selection.currentIndex = 5;

        var array = this.selection.changedIndices();
        expect(array).toContain(4);
        expect(array).toContain(5);
      });
    });

    describe('when (2, 3) to (2, 1)', function() {
      it('returns [1, 3]', function() {
        this.selection.startingIndex = 2;
        this.selection.previousIndex = 3;
        this.selection.currentIndex = 1;

        var array = this.selection.changedIndices();
        expect(array).toContain(1);
        expect(array).toContain(3);
      });
    });

    describe('when (5, 3) to (5, 1)', function() {
      it('returns [1, 2]', function() {
        this.selection.startingIndex = 5;
        this.selection.previousIndex = 3;
        this.selection.currentIndex = 1;

        var array = this.selection.changedIndices();
        expect(array).toContain(1);
        expect(array).toContain(2);
      });
    });

    describe('when (5, 1) to (5, 3)', function() {
      it('returns [1, 2]', function() {
        this.selection.startingIndex = 5;
        this.selection.previousIndex = 1;
        this.selection.currentIndex = 3;

        var array = this.selection.changedIndices();
        expect(array).toContain(1);
        expect(array).toContain(2);
      });
    });

    describe('when (3, 1) to (3, 5)', function() {
      it('returns [1, 2, 4, 5]', function() {
        this.selection.startingIndex = 3;
        this.selection.previousIndex = 1;
        this.selection.currentIndex = 5;

        var array = this.selection.changedIndices();
        expect(array).toContain(1);
        expect(array).toContain(2);
        expect(array).toContain(4);
        expect(array).toContain(5);
      });
    });
  });

  describe('#getText()', function() {
    it('returns text based on starting and current index', function() {
      this.selection.startingIndex = 1;
      this.selection.currentIndex = 3;

      this.selection.getText()
      expect(this.selection.words.getText).toHaveBeenCalledWith(1, 3)

      this.selection.startingIndex = 3;
      this.selection.currentIndex = 1;

      this.selection.getText()
      expect(this.selection.words.getText).toHaveBeenCalledWith(1, 3)
    });
  });
});
