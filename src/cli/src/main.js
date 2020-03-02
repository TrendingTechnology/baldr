#! /usr/bin/env node

const fs = require('fs')
const path = require('path')

const subcommandsPath = path.join(__dirname, 'subcommands')

let commander = require('commander')

for (const fileName of fs.readdirSync(subcommandsPath)) {
  const conf = require(path.join(subcommandsPath, fileName))
  const c = commander
    .command(conf.commandName)
    if (conf.alias) {
      c.alias(conf.alias)
    }
    c.description(conf.description)
    if (conf.options) {
      for (const option of conf.options) {
        console.log(option)
        c.option(option[0], option[1])
      }
    }
    c.action(conf.action)
}

commander.parse(process.argv)
