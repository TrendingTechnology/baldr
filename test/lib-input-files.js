const {
  assert,
  path,
} = require('baldr-test');

const {InputFiles} = require('baldr-input-files');

let input = new InputFiles(path.resolve('test', 'files'));

describe('Class “InputFiles()”', () => {

  it('Properties', function() {
    assert.equal(
      input.presentationPath,
      path.resolve('test', 'files')
    );
  });


  it('Method “resolvePath()”', function() {
    assert.equal(
      input.resolvePath('test.txt'),
      path.join(input.presentationPath, 'test.txt')
    );
    assert.equal(
      input.resolvePath('/tmp/test.txt'),
      '/tmp/test.txt'
    );
  });

  describe('Method “filter()”', function() {
    it('Nonexistent file', function() {
      assert.deepEqual(
        input.filter('loool.txt'),
        []
      );
    });

    it('A file (relative path)', function() {
      // relative to test/files
      assert.equal(
        input.filter('beethoven.jpg'),
        path.resolve('test/files/beethoven.jpg')
      );
    });

    it('A file (relative path), not matching', function() {
      // relative to test/files
      assert.deepEqual(
        input.filter('beethoven.jpg', ['lol']),
        []
      );
    });

    it('A path of a file (absolute path)', function() {
      assert.equal(
        input.filter(path.resolve('test/files/beethoven.jpg')),
        path.resolve('test/files/beethoven.jpg')
      );
    });

    it('A folder', function() {
      let testFiles = path.resolve('masters/image/images');
      assert.deepEqual(
        input.filter(testFiles, 'jpg'),
        [
          path.join(testFiles, 'beethoven.jpg'),
          path.join(testFiles, 'haydn.jpg'),
          path.join(testFiles, 'mozart.jpg')
        ]
      );
    });

    it('A folder without a match', function() {
      assert.deepEqual(
        input.filter(
          path.resolve('masters/image/images'),
          ['lol']
        ),
        []
      );
    });
  });

  it('Method “filterFileByExtension()”', function() {
    assert.ok(input.filterFileByExtension('lol.txt', ['txt']));
    assert.ok(input.filterFileByExtension('lol.txt', ['TXT']));
    assert.ok(input.filterFileByExtension('lol.TXT', ['txt']));
    assert.ok(input.filterFileByExtension('lol.txt', ['lol', 'txt']));
    assert.ok(input.filterFileByExtension('lol.txt'));
    assert.ok(input.filterFileByExtension('lol.txt', 'txt'));
    assert.ok(!input.filterFileByExtension('lol.txt', 'txxxt'));
    assert.ok(!input.filterFileByExtension('lol.txt', ['lol', 'troll']));
    assert.ok(!input.filterFileByExtension('lol.txt', ['txxxt']));
  });

});
