// Node packages.
const fs = require('fs')

const { yamlToTxt } = require('../lib.js')

/**
 * Convert a Audacity text mark file into a YAML file.
 *
 * @param {String} filePath - The file path of the Audacity’s text track
 *   file.
 */
function action (filePath) {
  const text = fs.readFileSync(filePath, { encoding: 'utf-8' })
  console.log(text)

  const lines = text.split('\n')
  const samples = []
  // Text mark maybe have no description. We use a counter instead
  let counter = 1
  for (const line of lines) {
    const match = line.match(/([\d\.]+)\t([\d\.]+)\t(.*)/) // eslint-disable-line
    if (match) {
      const startTime = Number(match[1])
      let endTime = Number(match[2])
      let title
      if (!match[3]) {
        title = String(counter)
      } else {
        title = match[3]
      }
      title = title.trim()
      const id = title.toLowerCase()

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
  console.log(yamlToTxt(samples))
}

module.exports = {
  command: 'audacity <input>',
  alias: 'a',
  description: 'Convert a Audacity text mark file into a YAML file.',
  action
}
