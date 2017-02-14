const assert = require('assert');

//var slu = require('songbook-library-update');

var rewire = require("rewire");
var slu = rewire("../index.js");

var config = slu.__get__("configDefault");

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(config.mtime, ".mtime");
    });
  });
});
