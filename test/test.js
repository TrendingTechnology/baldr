const assert = require('assert');

var rewire = require("rewire");
var slu = rewire("../index.js");

describe('Configuration', function() {
  var config = slu.__get__("configDefault");

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
  var getMscoreCommand = slu.__get__("getMscoreCommand");
  it('"getMscoreCommand()" should return "mscore"', function() {
    assert.equal(getMscoreCommand(), "mscore");
  });
});
