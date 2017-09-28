var assert = require('assert');
const fs = require('fs');
const path = require('path');


assert.exists = function() {
  assert.ok(
    fs.existsSync(
      path.join.apply(null, arguments)
    )
  );
};

exports.assert = assert
