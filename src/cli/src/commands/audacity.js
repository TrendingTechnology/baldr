// Project packages.
const mediaServer = require('@bldr/api-media-server')
const lib = require('../lib.js')

// Third party packages.
const chalk = require('chalk')

/**
 * Convert a Audacity text mark file into a YAML file.
 *
 * ```txt
 * 1.488171	1.488171	Sample 1
 * 11.635583	12.940996	Sample 2 (begin + end)
 * 13.846082	13.846082	Sample 3
 * ```
 *
 * ```yaml
 * ---
 * - id: sample 1
 *   title: Sample 1
 *   start_time: 1.488171
 *   end_time: 11.635583
 * - id: sample 2 (begin + end)
 *   title: Sample 2 (begin + end)
 *   start_time: 11.635583
 *   end_time: 12.940996
 * - id: '3'
 *   title: '3'
 *   start_time: 13.846082
 * ```
 *
 * @param {String} filePath - The file path of the Audacity’s text mark
 *   file.
 */
function action (filePath) {
  const text = lib.readFile(filePath)
  console.log(`The content of the source file “${chalk.yellow(filePath)}”:\n`)
  console.log(text)

  const lines = text.split('\n')
  const samples = []
  // Text mark maybe have no description. We use a counter instead
  let counter = 1
  for (const line of lines) {
    const match = line.match(/([\d\.]+)\t([\d\.]+)\t(.*)/) // eslint-disable-line
    if (match) {
      //  for example: 1.488171
      const startTime = Number(match[1])
      //  for example: 1.488171
      let endTime = Number(match[2])
      let title
      if (!match[3]) {
        title = String(counter)
      } else {
        // for example: Sample 1
        title = match[3]
      }
      title = title.trim()
      const id = mediaServer.asciify(title.toLowerCase())

      if (startTime === endTime) {
        endTime = null
      }
      const sample = {
        id,
        title,
        start_time: startTime
      }
      if (endTime) sample['end_time'] = endTime
      samples.push(sample)
    }
    counter += 1
  }
  for (const index in samples) {
    const sample = samples[index]
    if (!sample.end_time && index < samples.length - 1) {
      sample['end_time'] = samples[parseInt(index) + 1]['start_time']
    }
  }
  const dest = `${filePath}.yml`
  console.log(`The content of the destination file “${chalk.green(dest)}”:\n`)
  lib.writeYamlFile(dest, samples)
}

module.exports = {
  command: 'audacity <text-mark-file>',
  alias: 'au',
  description: [
    'Convert a Audacity text mark file into a YAML file.',
    'Use the keyboard shortcuts ctrl+b or ctrl+m to create text marks in the software Audacity.',
    'Go to the text mark manager (Edit > text marks) to export the marks.'
  ].join(' '),
  action
}
