const {
  assert,
  path,
  testFileMinimal
} = require('baldr-test');

const {Media, FileInfo} = require('baldr-media');

let input = new Media(path.resolve('test', 'files', 'mixed-extensions'));

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

describe('Class “FileInfo()”', () => {

  it('Instantiation', () => {
    let list = new FileInfo(testFileMinimal);
    assert.equal(typeof list, 'object');
    assert.equal(list.path, testFileMinimal);
    assert.equal(list.basename, 'minimal.baldr');
    assert.equal(list.extension, 'baldr');
  });

  describe('Properties', () => {
    it('Property “this.path”', () => {
      let list = new FileInfo(testFileMinimal);
      assert.equal(list.path, testFileMinimal);
    });

    it('Property “this.basename”', () => {
      let list = new FileInfo(testFileMinimal);
      assert.equal(list.basename, 'minimal.baldr');
    });

    it('Property “this.extension”', () => {
      let list = new FileInfo(testFileMinimal);
      assert.equal(list.extension, 'baldr');
    });

  });

  describe('Methods', () => {
    it('Method “readInfoYaml()”', () => {
      let basePath = path.resolve('test', 'files', 'media', 'image');

      let testInfo = function(fileName, result) {
        let filePath = path.resolve(basePath, fileName);
        let file = new FileInfo(filePath);
        let info = file.readInfoYaml();
        assert.equal(info.title, result);
        assert.equal(file.title, result);
      };

      testInfo('beethoven.jpg', 'Ludwig van Beethoven');
      testInfo('haydn.jpg', 'Joseph Haydn');
      testInfo('mozart.jpg', 'Wolfgang Amadeus Mozart');
    });

  });

});

describe('Class “Media()”', () => {

  describe('Properties', function() {

    it('this.parentPath', function() {
      assert.equal(
        input.parentPath,
        path.resolve('test', 'files', 'mixed-extensions')
      );
    });

    it('this.types', function() {
      assert.ok(input.types);
    });

    it('this.types.audio', function() {
      assert.deepEqual(input.types.audio, ['mp3']);
    });

    it('this.types.image', function() {
      assert.deepEqual(input.types.image, ['jpg', 'jpeg', 'png']);
    });

    it('this.types.video', function() {
      assert.deepEqual(input.types.video, ['mp4']);
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
        path.join(input.parentPath, 'test.txt')
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

    it('Method “listRecursively()”', () => {
      let list = input.listRecursively(
        path.resolve('test', 'files', 'mixed-extensions')
      );
      assert.ok(list[0].includes('audio/beethoven.m4a'));
      assert.ok(list.pop().includes('video/mozart.mp4'));
    });

    it('Method “groupByTypes()”', () => {
      let list = input.listRecursively(
        path.resolve('test', 'files', 'mixed-extensions')
      );
      let group = input.groupByTypes(list);

      assert.equal(group.audio.length, 3);
      assert.equal(group.image.length, 4);
      assert.equal(group.video.length, 4);
    });

    it('Method “getMedia()”', () => {
      let media = new Media(path.resolve('test', 'files', 'media'));
      let out = media.getMedia();

      assert.equal(out.audio.length, 3);
      assert.equal(out.image.length, 3);
      assert.equal(out.video.length, 3);

      assert.equal(out.audio[0].title, 'beethoven.mp3');
      assert.equal(out.image[0].profession, 'Composer');
      assert.equal(out.image[2].title, 'Wolfgang Amadeus Mozart');
    });

  });

});
