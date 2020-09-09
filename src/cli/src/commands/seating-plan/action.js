// Node packages.
const fs = require('fs')

// Third party packages.
const csv = require('csv-parser')

const documentTemplate = {
  grades: {},
  jobs: {
    Schaltwart: {
      icon: 'video-switch'
    },
    Austeilwart: {
      icon: 'file-outline'
    },
    Klassenbuchführer: {
      icon: 'notebook'
    },
    Klassensprecher: {
      icon: 'account-star'
    },
    Lüftwart: {
      icon: 'window-open'
    }
  },
  meta: {
    location: 'Pirckheimer-Gymnasium, Nürnberg',
    teacher: 'OStR Josef Friedrich',
    year: '2019/20'
  }
}

// Project packages.
const { CommandRunner } = require('@bldr/cli-utils')
const lib = require('../../lib.js')

/**
 * @param {String} mdbFile
 */
async function action (mdbFile) {
  const cmd = new CommandRunner()
  const result = await cmd.exec('mdb-export', mdbFile, 'Schüler')
  lib.writeFile('tmp.csv', result.stdout)

  const grades = {}

  fs.createReadStream('tmp.csv')
    .pipe(csv())
    .on('data', (data) => {
      if (grades[data.klasse]) {
        grades[data.klasse][`${data.name}, ${data.vorname}`] = {}
      } else {
        grades[data.klasse] = {}
      }
    })
    .on('end', () => {
      documentTemplate.grades = grades
      documentTemplate.timeStampMsec = new Date().getTime()
      lib.writeFile('seating-plan.json', JSON.stringify(documentTemplate, null, '  '))
    })
}

module.exports = action
