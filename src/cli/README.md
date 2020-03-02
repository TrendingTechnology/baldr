[![npm](https://img.shields.io/npm/v/baldr.svg)](https://www.npmjs.com/package/baldr)
[![Build Status](https://travis-ci.org/Josef-Friedrich/baldr.svg?branch=master)](https://travis-ci.org/Josef-Friedrich/baldr)
[![GitHub repo size](https://img.shields.io/github/repo-size/Josef-Friedrich/baldr.svg)](https://github.com/Josef-Friedrich/baldr)

# @bldr/cli

THE command line interface for the BALDR project.

```js
module.exports = {
  commandName: 'mirror <folder>',
  alias: 'm',
  options: [['-help', 'A help message']]
  checkExecutable: 'xdg-open',
  description: 'Create and open in the file explorer a relative path in different base paths.',
  action: function (folder, options) {

  }
}
```
