#! /usr/bin/env node

// Third party packages.
const glob = require('glob')
const Mocha = require('mocha')
const fs = require('fs-extra')

// Project packages.
const { utils } = require('@bldr/core')

console.log('Environment:\n')
console.log(process.env)
console.log('\n\n')

for (const distPath of [
  'src/electron-app/dist',
  'masters/songbook/src/electron-app/dist',
  'masters/camera/src/electron-app/dist'
]) {
  fs.removeSync(distPath)
  utils.log('Delete electron app at the location: %s', distPath)
}

const files = glob.sync(
  '*.test.js',
  {
    ignore: ['**/node_modules/**', '**/dist/**'],
    matchBase: true
  }
)

const mocha = new Mocha({ timeout: 50000 })

for (const file of files) {
  utils.log('Load test file: %s', file)
  mocha.addFile(file)
}

// Run the tests.
mocha.run(function (failures) {
  process.exitCode = failures ? 1 : 0
})
