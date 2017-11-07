const {
  assert,
  document,
  getDOM,
  path,
  presentation
} = require('baldr-test');

const rewire = require('rewire')('../lib/presentation.js');
const {Presentation} = require('../lib/presentation.js');

const minimal = path.join('test', 'files', 'minimal.baldr');

describe('Class “Presentation()”', () => {

  beforeEach(function() {
    this.prs = new Presentation(minimal, document);
  });

  describe('Properties', function() {

    it('this.slides', function() {
      assert.equal(this.prs.slides[1].masterName, 'quote');
    });

    it('this.count', function() {
      assert.equal(this.prs.count, 3);
    });

    it('this.no', function() {
      assert.equal(this.prs.no, 1);
    });

    it('this.pwd', function() {
      assert.equal(
        this.prs.pwd,
        path.resolve(path.dirname(minimal))
      );
    });

    it('this.currentSlide', function() {
      assert.equal(
        this.prs.currentSlide.masterName, 'quote'
      );
    });

  });

  it('Method “prev()”', function() {
    this.prs.prev();
    assert.equal(this.prs.no, 3);
    this.prs.prev();
    assert.equal(this.prs.no, 2);
    this.prs.prev();
    assert.equal(this.prs.no, 1);
    this.prs.prev();
    assert.equal(this.prs.no, 3);
  });

  it('Method “next()”', function() {
    this.prs.next();
    assert.equal(this.prs.no, 2);
    this.prs.next();
    assert.equal(this.prs.no, 3);
    this.prs.next();
    assert.equal(this.prs.no, 1);
    this.prs.next();
    assert.equal(this.prs.no, 2);
  });

  it('Method “set()”', function() {
    this.prs.set();
    assert.ok(this.prs.currentSlide.elemSlide.textContent.includes('Johann Wolfgang von Goethe'));
  });

  it('Method “absolutePath()”', function() {
    assert.equal(
      this.prs.absolutePath('test.txt'),
      path.join(this.prs.pwd, 'test.txt')
    );
    assert.equal(
      this.prs.absolutePath('/tmp/test.txt'),
      '/tmp/test.txt'
    );
  });

  describe('Method “filterFiles()”', function() {
    it('Nonexistent file: throws error', function() {
      assert.throws(
        () => {this.prs.filterFiles('loool.txt');},
        /The specified path “.*” does not exist!/
      );
    });

    it('A path of a file (relative path)', function() {
      // relative to test/files/minimal.baldr
      assert.equal(
        this.prs.filterFiles('beethoven.jpg'),
        path.resolve('test/files/beethoven.jpg')
      );
    });

    it('A path of a file (absolute path)', function() {
      assert.equal(
        this.prs.filterFiles(path.resolve('test/files/beethoven.jpg')),
        path.resolve('test/files/beethoven.jpg')
      );
    });

    it('A folder', function() {
      let testFiles = path.resolve('masters/image/images');
      assert.deepEqual(
        this.prs.filterFiles(testFiles),
        [
          path.join(testFiles, 'beethoven.jpg'),
          path.join(testFiles, 'haydn.jpg'),
          path.join(testFiles, 'mozart.jpg')
        ]
      );
    });

    it('A folder without a match', function() {
      assert.deepEqual(
        this.prs.filterFiles(
          path.resolve('masters/image/images'),
          ['lol']
        ),
        []
      );
    });
  });

  it('Method “filterFileByExtension()”', function() {
    assert.ok(this.prs.filterFileByExtension('lol.txt', ['txt']));
    assert.ok(this.prs.filterFileByExtension('lol.txt', ['TXT']));
    assert.ok(this.prs.filterFileByExtension('lol.TXT', ['txt']));
    assert.ok(this.prs.filterFileByExtension('lol.txt', ['lol', 'txt']));
    assert.ok(this.prs.filterFileByExtension('lol.txt'));
    assert.ok(this.prs.filterFileByExtension('lol.txt', 'txt'));
    assert.ok(!this.prs.filterFileByExtension('lol.txt', 'txxxt'));
    assert.ok(!this.prs.filterFileByExtension('lol.txt', ['lol', 'troll']));
    assert.ok(!this.prs.filterFileByExtension('lol.txt', ['txxxt']));
  });

  it('Method chaining', function() {
    this.prs.next().set();
    assert.ok(this.prs.currentSlide.elemSlide.textContent.includes('Ludwig van Beethoven'));
  });
});
