#! /usr/bin/env node

let glob = require('glob')
var Mocha = require('mocha')
let util = require('util')

let files = glob.sync('*.test.js', { ignore: '**/node_modules/**', matchBase: true })

let mocha = new Mocha()

for (let file of files) {
  console.log(util.format('Load test file: %s', file))
  mocha.addFile(file)
}

// Run the tests.
mocha.run(function (failures) {
  process.exitCode = failures ? 1 : 0
})
