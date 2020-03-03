[![npm](https://img.shields.io/npm/v/baldr.svg)](https://www.npmjs.com/package/baldr)
[![Build Status](https://travis-ci.org/Josef-Friedrich/baldr.svg?branch=master)](https://travis-ci.org/Josef-Friedrich/baldr)
[![GitHub repo size](https://img.shields.io/github/repo-size/Josef-Friedrich/baldr.svg)](https://github.com/Josef-Friedrich/baldr)

# @bldr/cli

THE command line interface for the BALDR project.

## Module exports for the (sub)commands

### Full skeleton

```js
module.exports = {
  command: 'mirror <required> [optional]', // see https://github.com/tj/commander.js#commands
  alias: 'm',
  options: [
    ['-l, --lorem', 'Print lorem'],
    ['-i, --ipsum', 'Print ipsum']
  ],
  checkExecutable: 'xdg-open', // or ['xdg-open', 'git']
  description: 'Create and open in the file explorer a relative path in different base paths.',
  action: function (required, optional, cmdObj) { // see https://github.com/tj/commander.js#action-handler-subcommands
    console.log(required)
    console.log(optional)
    console.log(cmdObj.lorem)
    console.log(cmdObj.ipsum)
  }
}
```

### Minimal skeleton

```js
module.exports = {
  command: '',
  alias: '',
  description: '',
  action
}
```
