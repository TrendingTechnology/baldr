#! /usr/bin/env node

// Node libary
const util = require('util')

// Third party
const glob = require('glob')
const Mocha = require('mocha')
const fs = require('fs-extra')

console.log('Environment:\n')
console.log(process.env)
console.log('\n\n')

for (const distPath of ['src/electron-app/dist', 'masters/songbook/packages/electron-app/dist', 'masters/camera/electron-app/dist']) {
  fs.removeSync(distPath)
  console.log(util.format('Delete electron app at the location: %s', distPath))
}

const files = glob.sync('*.test.js', { ignore: ['**/node_modules/**', '**/dist/**'], matchBase: true })

const mocha = new Mocha({ timeout: 50000 })

for (const file of files) {
  console.log(util.format('Load test file: %s', file))
  mocha.addFile(file)
}

// Run the tests.
mocha.run(function (failures) {
  process.exitCode = failures ? 1 : 0
})
