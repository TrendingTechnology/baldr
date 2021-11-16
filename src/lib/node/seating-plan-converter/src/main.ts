/**
 * @module @bldr/seating-plan-converter
 */

// Node packages.
import fs from 'fs'

// Third party packages.
import csv from 'csv-parser'

// Project packages.
import { CommandRunner } from '@bldr/cli-utils'
import { writeFile } from '@bldr/file-reader-writer'
import { getFormatedSchoolYear } from '@bldr/core-browser'
import { getConfig } from '@bldr/config'

const config = getConfig()

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
    location: config.meta.school,
    teacher: config.meta.teacher,
    year: getFormatedSchoolYear()
  }
}

interface CsvRow {
  vorname: string
  name: string
  klasse: string
}

export async function convertNotenmanagerMdbToJson (
  mdbFile: string
): Promise<typeof documentTemplate> {
  const cmd = new CommandRunner()
  const result = await cmd.exec(['mdb-export', mdbFile, 'Schüler'])
  if (result?.stdout != null) {
    writeFile('tmp.csv', result.stdout)
  }
  const grades: { [key: string]: any } = {}

  return await new Promise(function (resolve, reject) {
    fs.createReadStream('tmp.csv')
      .pipe(csv())
      .on('data', row => {
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
        writeFile(
          'seating-plan.json',
          JSON.stringify(documentTemplate, null, '  ')
        )
        resolve(documentTemplate)
      })
  })
}
