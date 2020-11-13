// Third party packages.
import chalk from 'chalk'

// Project packages.
import { writeYamlFile, asciify } from '@bldr/media-manager'
import { readFile } from '@bldr/core-node'

/**
 * Convert a Audacity text mark file into a YAML file.
 *
 * ```txt
 * 1.488171\t1.488171\tSample 1
 * 11.635583\t12.940996\tSample 2 (begin + end)
 * 13.846082\t13.846082\tSample 3
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
function action (filePath: string) {
  const text = readFile(filePath)
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
      let endTime: number | undefined = Number(match[2])
      let title
      if (!match[3]) {
        title = String(counter)
      } else {
        // for example: Sample 1
        title = match[3]
      }
      title = title.trim()
      const id = asciify(title.toLowerCase())

      if (startTime === endTime) {
        endTime = undefined
      }
      const sample: { [key: string]: any } = {
        id,
        title,
        startTime: startTime
      }
      if (endTime) sample.endTime = endTime
      samples.push(sample)
    }
    counter += 1
  }
  for (const index in samples) {
    const sample = samples[index]
    if (!sample.endTime && parseInt(index) < samples.length - 1) {
      sample.endTime = samples[parseInt(index) + 1].startTime
    }
  }
  const dest = `${filePath}.yml`
  console.log(`The content of the destination file “${chalk.green(dest)}”:\n`)
  writeYamlFile(dest, samples)
}

export = action
