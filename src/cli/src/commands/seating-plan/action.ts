// Node packages.
import fs from 'fs'

// Third party packages.
import csv from 'csv-parser'

// Project packages.
import { CommandRunner } from '@bldr/cli-utils'
import { writeFile } from '@bldr/core-node'

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
  timeStampMsec: 0,
  meta: {
    location: 'Pirckheimer-Gymnasium, Nürnberg',
    teacher: 'OStR Josef Friedrich',
    year: '2019/20'
  }
}

/**
 * @param  mdbFile
 */
async function action (mdbFile: string): Promise<void> {
  const cmd = new CommandRunner()
  const result = await cmd.exec(['mdb-export', mdbFile, 'Schüler'])
  if (result && result.stdout) {
    writeFile('tmp.csv', result.stdout)
  }

  const grades: { [key: string]: any } = {}

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
      writeFile('seating-plan.json', JSON.stringify(documentTemplate, null, '  '))
    })
}

export = action
