const assert = require('assert');
const path = require('path')
const fs = require('fs');

const rewire = require("rewire");
const slu = rewire("../index.js");

describe('Configuration', function() {
  const config = slu.__get__("configDefault");

  describe('default configuration', function() {
    it('"config.json" should return "songs.json"', function() {
      assert.equal(config.json, "songs.json");
    });
    it('"config.info" should return "info.json"', function() {
      assert.equal(config.info, "info.json");
    });
    it('"config.mtime" should return ".mtime"', function() {
      assert.equal(config.mtime, ".mtime");
    });
  });
});

describe('Functions', function() {
  it('"getMscoreCommand()" should return "mscore"', function() {
    const getMscoreCommand = slu.__get__("getMscoreCommand");
    assert.equal(getMscoreCommand(), "mscore");
  });

  it('"generatePDF()"', function() {
    const generatePDF = slu.__get__("generatePDF");
    const folder = path.join('songs', 'Swing-low');
    generatePDF(folder, 'projector', 'projector');
    assert.ok(fs.existsSync(path.join(folder, 'projector.pdf')));
  });

  it('"deleteFile()"', function() {
    const deleteFile = slu.__get__("deleteFile");
    const folder = path.join('songs', 'Swing-low');
    const fileName = 'test.txt';
    const file = path.join(folder, fileName);
    fs.appendFileSync(file, 'test')
    assert.ok(fs.existsSync(file));
    deleteFile(folder, fileName);
    assert.ok(!fs.existsSync(file));
  });

  it.skip('"pull()"', function(done) {
    const pull = slu.__get__("pull");
    this.slow(10000000);
    pull();
    assert.ok(1);
  });
});
