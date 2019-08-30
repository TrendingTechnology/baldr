#! /usr/bin/env node

const glob = require('glob')
const fs = require('fs')

const files = glob.sync('**/*', { ignore: ['**/*.conf'] })

for (const file of files) {
  if (!fs.lstatSync(file).isDirectory()) {
    console.log(file)
  }
}