const {
  assert,
  path,
  testFileMinimal,
  rewire,
  srcPath
} = require('baldr-test')

let mediaJsPath = srcPath('lib', 'media.js')

const { Media } = require(mediaJsPath)
let mediaRewired = rewire(mediaJsPath)
let FileInfo = mediaRewired.__get__('FileInfo')

let testFiles = path.resolve('test', 'files', 'mixed-extensions')
let media = new Media(testFiles)

let resolve = function (folder, file) {
  return path.join(testFiles, folder, file)
}

describe('Class “FileInfo()” #unittest', () => {
  it('Instantiation', () => {
    let list = new FileInfo(testFileMinimal)
    assert.equal(typeof list, 'object')
    assert.equal(list.path, testFileMinimal)
    assert.equal(list.basename, 'minimal.baldr')
    assert.equal(list.extension, 'baldr')
  })

  describe('Properties', () => {
    it('Property “this.path”', () => {
      let list = new FileInfo(testFileMinimal)
      assert.equal(list.path, testFileMinimal)
    })

    it('Property “this.basename”', () => {
      let list = new FileInfo(testFileMinimal)
      assert.equal(list.basename, 'minimal.baldr')
    })

    it('Property “this.extension”', () => {
      let list = new FileInfo(testFileMinimal)
      assert.equal(list.extension, 'baldr')
    })

    it('Property “this.titleSafe', () => {
      let getFileInfo = function () {
        return new FileInfo(
          path.resolve('test', 'files', 'media', ...arguments)
        )
      }
      assert.equal(
        getFileInfo('audio', 'beethoven.mp3').titleSafe,
        'beethoven.mp3'
      )
      assert.equal(
        getFileInfo('image', 'beethoven.jpg').titleSafe,
        'Ludwig van Beethoven'
      )

      assert.equal(
        getFileInfo('audio', 'haydn.mp3').titleSafe,
        'Joseph Haydn: The Surprise'
      )
    })
  })

  describe('Methods', () => {
    it('Method “readInfoYaml_()”', () => {
      let basePath = path.resolve('test', 'files', 'media', 'image')

      let testInfo = function (fileName, result) {
        let filePath = path.resolve(basePath, fileName)
        let file = new FileInfo(filePath)
        let info = file.readInfoYaml_()
        assert.equal(info.title, result)
        assert.equal(file.title, result)
      }

      testInfo('beethoven.jpg', 'Ludwig van Beethoven')
      testInfo('haydn.jpg', 'Joseph Haydn')
      testInfo('mozart.jpg', 'Wolfgang Amadeus Mozart')
    })
  })
})

describe('Class “Media()” #unittest', () => {
  describe('Properties', function () {
    it('this.parentPath', function () {
      assert.equal(
        media.parentPath,
        path.resolve('test', 'files', 'mixed-extensions')
      )
    })

    it('this.types', function () {
      assert.ok(media.types)
    })

    it('this.types.audio', function () {
      assert.deepEqual(media.types.audio, ['mp3'])
    })

    it('this.types.image', function () {
      assert.deepEqual(media.types.image, ['jpg', 'jpeg', 'png'])
    })

    it('this.types.video', function () {
      assert.deepEqual(media.types.video, ['mp4'])
    })
  })

  describe('Methods', () => {
    it('Method “getExtensions_()”', function () {
      assert.deepEqual(media.getExtensions_(['lol']), ['lol'])
      assert.deepEqual(media.getExtensions_(['lol', 'troll']), ['lol', 'troll'])
      assert.deepEqual(media.getExtensions_('lol'), ['lol'])
      assert.deepEqual(media.getExtensions_('audio'), ['mp3'])
      assert.deepEqual(media.getExtensions_('image'), ['jpg', 'jpeg', 'png'])
      assert.deepEqual(media.getExtensions_('video'), ['mp4'])
    })

    it('Method “resolvePath_()”', function () {
      assert.equal(
        media.resolvePath_('test.txt'),
        path.join(media.parentPath, 'test.txt')
      )
      assert.equal(
        media.resolvePath_('/tmp/test.txt'),
        '/tmp/test.txt'
      )
    })

    describe('Method “list()”', function () {
      it('Nonexistent file', function () {
        assert.deepEqual(
          media.list('loool.txt'),
          []
        )
      })

      it('A file (relative path)', function () {
        // relative to test/files
        assert.equal(
          media.list('image/beethoven.jpg')[0].path,
          resolve('image', 'beethoven.jpg')
        )
      })

      it('A file (relative path), not matching', function () {
        // relative to test/files
        assert.deepEqual(
          media.list('image/beethoven.jpg', ['lol']),
          []
        )
      })

      it('Absolute path of a file', function () {
        assert.equal(
          media.list(resolve('image', 'beethoven.jpg'))[0].path,
          resolve('image', 'beethoven.jpg')
        )
      })

      it('A folder', function () {
        let out = media.list(
          path.resolve('test/files/mixed-extensions/image')
        )
        assert.equal(out[2].basename, 'mozart.jpeg')
      })

      it('A folder without a match', function () {
        assert.deepEqual(
          media.list(
            path.resolve('masters/media/images'),
            ['lol']
          ),
          []
        )
      })
    })

    it('Method “filterFile()”', function () {
      assert.ok(media.filterFile('lol.txt', ['txt']))
      assert.ok(media.filterFile('lol.txt', ['TXT']))
      assert.ok(media.filterFile('lol.TXT', ['txt']))
      assert.ok(media.filterFile('lol.txt', ['lol', 'txt']))
      assert.ok(media.filterFile('lol.txt'))
      assert.ok(media.filterFile('lol.txt', 'txt'))
      assert.ok(!media.filterFile('lol.txt', 'txxxt'))
      assert.ok(!media.filterFile('lol.txt', ['lol', 'troll']))
      assert.ok(!media.filterFile('lol.txt', ['txxxt']))
    })

    describe('Method “orderedList()”', () => {
      it('Single file as string', () => {
        let out = media.orderedList('image/beethoven.jpg')
        assert.equal(out[0].basename, 'beethoven.jpg')
      })

      it('Single file as array', () => {
        let out = media.orderedList(['image/beethoven.jpg'])
        assert.equal(out[0].basename, 'beethoven.jpg')
      })

      it('Single folder as string', () => {
        let out = media.orderedList('image')
        assert.equal(out[2].basename, 'mozart.jpeg')
      })

      it('Single folder as array', () => {
        let out = media.orderedList(['image'])
        assert.equal(out[2].basename, 'mozart.jpeg')
      })

      it('Multiple folders as array', () => {
        let out = media.orderedList(['image', 'audio'])
        assert.equal(out[0].basename, 'beethoven.jpg')
        assert.equal(out[0].path, path.join(testFiles, 'image', 'beethoven.jpg'))
        assert.equal(out[1].basename, 'haydn.png')
        assert.equal(out[2].basename, 'mozart.jpeg')
        assert.equal(out[3].basename, 'beethoven.m4a')
        assert.equal(out[3].path, path.join(testFiles, 'audio', 'beethoven.m4a'))
        assert.equal(out[4].basename, 'haydn.mp3')
        assert.equal(out[5].basename, 'mozart.mp3')
      })

      it('Multiple files as array', () => {
        let out = media.orderedList(
          [
            'video/haydn.mp4',
            'audio/beethoven.m4a',
            'image/mozart.jpeg'
          ]
        )

        assert.equal(out[0].basename, 'haydn.mp4')
        assert.equal(out[1].basename, 'beethoven.m4a')
        assert.equal(out[2].basename, 'mozart.jpeg')
      })
    })

    it('Method “listRecursively_()”', () => {
      let list = media.listRecursively_(
        path.resolve('test', 'files', 'mixed-extensions')
      )
      assert.ok(list[0].includes('audio/beethoven.m4a'))
      assert.ok(list.pop().includes('video/mozart.mp4'))
    })

    it('Method “groupByTypes_()”', () => {
      let list = media.listRecursively_(
        path.resolve('test', 'files', 'mixed-extensions')
      )
      let group = media.groupByTypes_(list)

      assert.equal(group.audio.length, 3)
      assert.equal(group.image.length, 4)
      assert.equal(group.video.length, 4)
    })

    it('Method “getMedia()”', () => {
      let media = new Media(path.resolve('test', 'files', 'media'))
      let out = media.getMedia()

      assert.equal(out.audio.length, 3)
      assert.equal(out.image.length, 3)
      assert.equal(out.video.length, 3)

      assert.equal(out.audio[0].basename, 'beethoven.mp3')
      assert.equal(out.image[0].profession, 'Composer')
      assert.equal(out.image[2].title, 'Wolfgang Amadeus Mozart')
    })
  })
})
