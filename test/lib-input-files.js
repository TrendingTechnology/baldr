const {
  assert,
  path,
} = require('baldr-test');

const {InputFiles} = require('baldr-input-files');

let input = new InputFiles(path.resolve('test', 'files', 'mixed-extensions'));

let resolve = function(folder, file) {
  return path.resolve('test', 'files', 'mixed-extensions', folder, file);
};

let resolveAudio = function(file) {
  return resolve('audio', file);
};

let resolveImage = function(file) {
  return resolve('image', file);
};

let resolveVideo = function(file) {
  return resolve('video', file);
};

let expectedImage = [
  resolveImage('beethoven.jpg'),
  resolveImage('haydn.png'),
  resolveImage('mozart.jpeg')
];

let orderedList = function() {
  input.orderedList(['images']);
};

describe('Class “InputFiles()”', () => {

  describe('Properties', function() {

    it('this.presentationPath', function() {
      assert.equal(
        input.presentationPath,
        path.resolve('test', 'files', 'mixed-extensions')
      );
    });

    it('this.extensionDefaults', function() {
      assert.ok(input.extensionDefaults);
    });

    it('this.extensionDefaults.audio', function() {
      assert.deepEqual(input.extensionDefaults.audio, ['mp3']);
    });

    it('this.extensionDefaults.image', function() {
      assert.deepEqual(input.extensionDefaults.image, ['jpg', 'jpeg', 'png']);
    });

    it('this.extensionDefaults.video', function() {
      assert.deepEqual(input.extensionDefaults.video, ['mp4']);
    });

  });

  describe('Methods', () => {
    it('Method “getExtensions()”', function() {
      assert.deepEqual(input.getExtensions(['lol']), ['lol']);
      assert.deepEqual(input.getExtensions(['lol', 'troll']), ['lol', 'troll']);
      assert.deepEqual(input.getExtensions('lol'), ['lol']);
      assert.deepEqual(input.getExtensions('audio'), ['mp3']);
      assert.deepEqual(input.getExtensions('image'), ['jpg', 'jpeg', 'png']);
      assert.deepEqual(input.getExtensions('video'), ['mp4']);
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

    describe('Method “list()”', function() {
      it('Nonexistent file', function() {
        assert.deepEqual(
          input.list('loool.txt'),
          []
        );
      });

      it('A file (relative path)', function() {
        // relative to test/files
        assert.deepEqual(
          input.list('image/beethoven.jpg'),
          [resolve('image', 'beethoven.jpg')]
        );
      });

      it('A file (relative path), not matching', function() {
        // relative to test/files
        assert.deepEqual(
          input.list('image/beethoven.jpg', ['lol']),
          []
        );
      });

      it('Absolute path of a file', function() {
        assert.deepEqual(
          input.list(resolve('image', 'beethoven.jpg')),
          [resolve('image', 'beethoven.jpg')]
        );
      });

      it('A folder', function() {
        assert.deepEqual(
          input.list(path.resolve('test/files/mixed-extensions/image'), 'image'),
          expectedImage
        );
      });

      it('A folder without a match', function() {
        assert.deepEqual(
          input.list(
            path.resolve('masters/input/images'),
            ['lol']
          ),
          []
        );
      });
    });

    it('Method “filterFile()”', function() {
      assert.ok(input.filterFile('lol.txt', ['txt']));
      assert.ok(input.filterFile('lol.txt', ['TXT']));
      assert.ok(input.filterFile('lol.TXT', ['txt']));
      assert.ok(input.filterFile('lol.txt', ['lol', 'txt']));
      assert.ok(input.filterFile('lol.txt'));
      assert.ok(input.filterFile('lol.txt', 'txt'));
      assert.ok(!input.filterFile('lol.txt', 'txxxt'));
      assert.ok(!input.filterFile('lol.txt', ['lol', 'troll']));
      assert.ok(!input.filterFile('lol.txt', ['txxxt']));
    });

    describe('Method “orderedList()”', () => {

      it('Single file as string', () => {
        assert.deepEqual(
          input.orderedList('image/beethoven.jpg'),
          [resolveImage('beethoven.jpg')]
        );
      });

      it('Single file as array', () => {
        assert.deepEqual(
          input.orderedList(['image/beethoven.jpg']),
          [resolveImage('beethoven.jpg')]
        );
      });

      it('Single folder as string', () => {
        assert.deepEqual(
          input.orderedList('image'),
          expectedImage
        );
      });

      it('Single folder as array', () => {
        assert.deepEqual(
          input.orderedList(['image']),
          expectedImage
        );
      });

      it('Multiple folders as array', () => {
        assert.deepEqual(
          input.orderedList(['image', 'audio']),
          [
            resolveImage('beethoven.jpg'),
            resolveImage('haydn.png'),
            resolveImage('mozart.jpeg'),
            resolveAudio('beethoven.m4a'),
            resolveAudio('haydn.mp3'),
            resolveAudio('mozart.mp3')
          ]
        );
      });

      it('Multiple files as array', () => {
        assert.deepEqual(
          input.orderedList(
            [
              'video/haydn.mp4',
              'audio/beethoven.m4a',
              'image/mozart.jpeg'
            ]
          ),
          [
            resolveVideo('haydn.mp4'),
            resolveAudio('beethoven.m4a'),
            resolveImage('mozart.jpeg')
          ]
        );
      });
    });
  });
});
