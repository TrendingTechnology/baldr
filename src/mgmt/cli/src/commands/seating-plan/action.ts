// Node packages.
import fs from 'fs'

// Third party packages.
import csv from 'csv-parser'

// Project packages.
import { CommandRunner } from '@bldr/cli-utils'
import { writeFile } from '@bldr/file-reader-writer'

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

interface CsvRow {
  vorname: string
  name: string
  klasse: string
}

async function action (mdbFile: string): Promise<void> {
  const cmd = new CommandRunner()
  const result = await cmd.exec(['mdb-export', mdbFile, 'Schüler'])
  if (result?.stdout != null) {
    writeFile('tmp.csv', result.stdout)
  }

  const grades: { [key: string]: any } = {}

  fs.createReadStream('tmp.csv')
    .pipe(csv())
    .on('data', (row) => {
      const data = row as CsvRow
      if (grades[data.klasse] != null) {
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
